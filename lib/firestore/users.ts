// lib/firestore/users.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  setDoc,
  deleteDoc,
  updateDoc,
  increment,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "../../types/connect";

// Build search tokens once at signup/profile-update time so search is just
// an array-contains query (no full external search service needed).
export function buildSearchTokens(displayName: string, username: string): string[] {
  const tokens = new Set<string>();
  const addPrefixes = (str: string) => {
    const s = str.toLowerCase().trim();
    for (let i = 1; i <= s.length; i++) tokens.add(s.slice(0, i));
    s.split(/\s+/).forEach((word) => {
      for (let i = 1; i <= word.length; i++) tokens.add(word.slice(0, i));
    });
  };
  addPrefixes(displayName);
  addPrefixes(username);
  return Array.from(tokens).slice(0, 200); // Firestore array field practical cap
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() } as UserProfile;
}

export async function searchUsersByName(term: string, max = 10): Promise<UserProfile[]> {
  const t = term.toLowerCase().trim();
  if (!t) return [];
  const q = query(
    collection(db, "users"),
    where("searchTokens", "array-contains", t),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserProfile));
}

export async function fetchMentors(track?: string): Promise<UserProfile[]> {
  const constraints = track
    ? [where("isMentor", "==", true), where("track", "==", track)]
    : [where("isMentor", "==", true)];
  const q = query(collection(db, "users"), ...constraints, limit(50));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserProfile));
}

// ---------- follow / connect ----------

function connectionId(followerId: string, followingId: string) {
  return `${followerId}_${followingId}`;
}

export async function isFollowing(followerId: string, followingId: string) {
  const snap = await getDoc(doc(db, "connections", connectionId(followerId, followingId)));
  return snap.exists();
}

export async function toggleFollow(followerId: string, followingId: string): Promise<boolean> {
  if (followerId === followingId) throw new Error("Cannot follow yourself");
  const connRef = doc(db, "connections", connectionId(followerId, followingId));
  const followerRef = doc(db, "users", followerId);
  const followingRef = doc(db, "users", followingId);

  return runTransaction(db, async (tx) => {
    const connSnap = await tx.get(connRef);
    if (connSnap.exists()) {
      tx.delete(connRef);
      tx.update(followerRef, { followingCount: increment(-1) });
      tx.update(followingRef, { followersCount: increment(-1) });
      return false;
    } else {
      tx.set(connRef, { followerId, followingId, createdAt: serverTimestamp() });
      tx.update(followerRef, { followingCount: increment(1) });
      tx.update(followingRef, { followersCount: increment(1) });
      return true;
    }
  });
}

export async function fetchFollowers(uid: string): Promise<string[]> {
  const q = query(collection(db, "connections"), where("followingId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().followerId as string);
}

export async function fetchFollowing(uid: string): Promise<string[]> {
  const q = query(collection(db, "connections"), where("followerId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data().followingId as string);
}