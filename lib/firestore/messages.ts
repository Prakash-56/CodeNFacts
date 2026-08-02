// lib/firestore/messages.ts
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Conversation, ChatMessage, ConversationParticipant } from "../../types/connect";

function conversationId(uidA: string, uidB: string) {
  return [uidA, uidB].sort().join("_");
}

export async function getOrCreateConversation(
  me: { uid: string } & ConversationParticipant,
  other: { uid: string } & ConversationParticipant
): Promise<string> {
  const id = conversationId(me.uid, other.uid);
  const ref = doc(db, "conversations", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      id,
      participantIds: [me.uid, other.uid],
      participants: {
        [me.uid]: { displayName: me.displayName, username: me.username, photoURL: me.photoURL },
        [other.uid]: { displayName: other.displayName, username: other.username, photoURL: other.photoURL },
      },
      lastMessage: "",
      lastMessageAt: serverTimestamp(),
      lastMessageSenderId: "",
      unreadCount: { [me.uid]: 0, [other.uid]: 0 },
      createdAt: serverTimestamp(),
    });
  }
  return id;
}

export async function sendMessage(conversationId: string, senderId: string, recipientId: string, text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;

  await addDoc(collection(db, "conversations", conversationId, "messages"), {
    senderId,
    text: trimmed,
    createdAt: serverTimestamp(),
    readBy: [senderId],
  });

  await updateDoc(doc(db, "conversations", conversationId), {
    lastMessage: trimmed,
    lastMessageAt: serverTimestamp(),
    lastMessageSenderId: senderId,
    [`unreadCount.${recipientId}`]: increment(1),
  });
}

export async function markConversationRead(conversationId: string, uid: string) {
  await updateDoc(doc(db, "conversations", conversationId), {
    [`unreadCount.${uid}`]: 0,
  });
}

// Realtime listeners — use these in client components for live chat / inbox.

export function listenToConversations(
  uid: string,
  cb: (conversations: Conversation[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "conversations"),
    where("participantIds", "array-contains", uid),
    orderBy("lastMessageAt", "desc"),
    limit(50)
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Conversation)));
  });
}

export function listenToMessages(
  conversationId: string,
  cb: (messages: ChatMessage[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "conversations", conversationId, "messages"),
    orderBy("createdAt", "asc"),
    limit(200)
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChatMessage)));
  });
}