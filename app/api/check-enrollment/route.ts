import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { userId, courseId } = await req.json();

    const userDoc = await db.collection("users").doc(userId).get();

    const data = userDoc.data();

    const enrolled =
      data?.purchasedCourses?.includes(courseId) || false;

    return NextResponse.json({ enrolled });

  } catch (error) {
    return NextResponse.json({ enrolled: false });
  }
}