import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function getUserPurchases(userId: string) {
  const q = query(
    collection(db, "purchases"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  const purchases = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return purchases;
}