// lib/firestore/posts.ts
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  serverTimestamp,
  increment,
  runTransaction,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { Post, PostType, MAX_PDF_PAGES } from "../../types/connect";

const POSTS_PAGE_SIZE = 10;

// ---------- mention / tag parsing ----------

export function parseMentions(text: string): string[] {
  const matches = text.match(/@([a-zA-Z0-9_]{3,30})/g) || [];
  return Array.from(new Set(matches.map((m) => m.slice(1).toLowerCase())));
}

export function parseTags(text: string): string[] {
  const matches = text.match(/#([a-zA-Z0-9_]{2,30})/g) || [];
  return Array.from(new Set(matches.map((m) => m.slice(1).toLowerCase())));
}

// Resolve @username mentions to uids by looking them up in `users` collection.
// Called right before writing the post.
export async function resolveMentionUids(usernames: string[]): Promise<string[]> {
  const uids: string[] = [];
  for (const uname of usernames) {
    const q = query(
      collection(db, "users"),
      where("usernameLower", "==", uname.toLowerCase()),
      limit(1)
    );
    const snap = await getDocs(q);
    if (!snap.empty) uids.push(snap.docs[0].id);
  }
  return uids;
}

// ---------- PDF page-count check (client side, before upload) ----------
// Uses pdf-lib (lightweight, browser-safe) to read page count without a server round trip.
export async function getPdfPageCount(file: File): Promise<number> {
  const { PDFDocument } = await import("pdf-lib");
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return pdf.getPageCount();
}

export async function uploadPostAttachment(
  uid: string,
  postId: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ url: string; pageCount: number | null }> {
  let pageCount: number | null = null;

  if (file.type === "application/pdf") {
    pageCount = await getPdfPageCount(file);
    if (pageCount > MAX_PDF_PAGES) {
      throw new Error(
        `PDF has ${pageCount} pages. Max allowed is ${MAX_PDF_PAGES} pages.`
      );
    }
  }

  const storageRef = ref(storage, `posts/${uid}/${postId}/${file.name}`);

  if (onProgress) {
    const task = uploadBytesResumable(storageRef, file);
    await new Promise<void>((resolve, reject) => {
      task.on(
        "state_changed",
        (snap) => onProgress((snap.bytesTransferred / snap.totalBytes) * 100),
        reject,
        () => resolve()
      );
    });
  } else {
    await uploadBytes(storageRef, file);
  }

  const url = await getDownloadURL(storageRef);
  return { url, pageCount };
}

// ---------- create post ----------

export interface CreatePostInput {
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorPhotoURL: string | null;
  type: PostType;
  content: string;
  file?: File | null;
  onUploadProgress?: (pct: number) => void;
  achievement?: { title: string; issuer: string; dateIssued: Date } | null;
}

export async function createPost(input: CreatePostInput): Promise<string> {
  const mentionUsernames = parseMentions(input.content);
  const tags = parseTags(input.content);
  const mentions = await resolveMentionUids(mentionUsernames);

  // create doc first (without attachment) to get an id for storage path
  const postRef = await addDoc(collection(db, "posts"), {
    authorId: input.authorId,
    authorName: input.authorName,
    authorUsername: input.authorUsername,
    authorPhotoURL: input.authorPhotoURL,
    type: input.type,
    content: input.content,
    mentions,
    tags,
    attachment: null,
    achievement: input.achievement
      ? {
          title: input.achievement.title,
          issuer: input.achievement.issuer,
          dateIssued: input.achievement.dateIssued,
        }
      : null,
    likeCount: 0,
    commentCount: 0,
    shareCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    visibility: "public",
  });

  if (input.file) {
    const kind =
      input.file.type === "application/pdf"
        ? "pdf"
        : input.file.type.startsWith("audio")
        ? "audio"
        : "image";

    const { url, pageCount } = await uploadPostAttachment(
      input.authorId,
      postRef.id,
      input.file,
      input.onUploadProgress
    );

    await updateDoc(postRef, {
      attachment: {
        kind,
        url,
        name: input.file.name,
        sizeBytes: input.file.size,
        pageCount,
        durationSeconds: null,
      },
    });
  }

  // bump author's postsCount
  await updateDoc(doc(db, "users", input.authorId), {
    postsCount: increment(1),
  });

  // create mention notifications
  for (const mentionedUid of mentions) {
    if (mentionedUid === input.authorId) continue;
    await addDoc(collection(db, "notifications"), {
      userId: mentionedUid,
      actorId: input.authorId,
      actorName: input.authorName,
      type: "mention",
      postId: postRef.id,
      read: false,
      createdAt: serverTimestamp(),
    });
  }

  return postRef.id;
}

// ---------- feed ----------

export async function fetchFeedPage(
  cursor?: QueryDocumentSnapshot
): Promise<{ posts: Post[]; lastDoc: QueryDocumentSnapshot | null }> {
  const base = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    ...(cursor ? [startAfter(cursor)] : []),
    limit(POSTS_PAGE_SIZE)
  );
  const snap = await getDocs(base);
  const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
  return { posts, lastDoc: snap.docs[snap.docs.length - 1] || null };
}

export async function fetchUserPosts(uid: string): Promise<Post[]> {
  const q = query(
    collection(db, "posts"),
    where("authorId", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
}

export async function deletePost(postId: string, authorId: string) {
  await deleteDoc(doc(db, "posts", postId));
  await updateDoc(doc(db, "users", authorId), { postsCount: increment(-1) });
}

// ---------- likes ----------

export async function toggleLike(postId: string, uid: string): Promise<boolean> {
  const likeRef = doc(db, "posts", postId, "likes", uid);
  const postRef = doc(db, "posts", postId);

  return runTransaction(db, async (tx) => {
    const likeSnap = await tx.get(likeRef);
    if (likeSnap.exists()) {
      tx.delete(likeRef);
      tx.update(postRef, { likeCount: increment(-1) });
      return false;
    } else {
      tx.set(likeRef, { uid, createdAt: serverTimestamp() });
      tx.update(postRef, { likeCount: increment(1) });
      return true;
    }
  });
}

export async function hasLiked(postId: string, uid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, "posts", postId, "likes", uid));
  return snap.exists();
}

// ---------- comments ----------

export async function addComment(
  postId: string,
  author: { uid: string; name: string; username: string; photoURL: string | null },
  content: string,
  parentCommentId: string | null = null
) {
  const mentionUsernames = parseMentions(content);
  const mentions = await resolveMentionUids(mentionUsernames);

  await addDoc(collection(db, "posts", postId, "comments"), {
    postId,
    authorId: author.uid,
    authorName: author.name,
    authorUsername: author.username,
    authorPhotoURL: author.photoURL,
    content,
    mentions,
    parentCommentId,
    likeCount: 0,
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "posts", postId), { commentCount: increment(1) });

  for (const mentionedUid of mentions) {
    if (mentionedUid === author.uid) continue;
    await addDoc(collection(db, "notifications"), {
      userId: mentionedUid,
      actorId: author.uid,
      actorName: author.name,
      type: "mention",
      postId,
      read: false,
      createdAt: serverTimestamp(),
    });
  }
}

export async function fetchComments(postId: string) {
  const q = query(
    collection(db, "posts", postId, "comments"),
    orderBy("createdAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}