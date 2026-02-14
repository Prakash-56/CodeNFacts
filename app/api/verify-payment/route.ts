import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { orderId, userId, courseId } = await req.json();

    if (!orderId || !userId || !courseId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://sandbox.cashfree.com/pg/orders/${orderId}`,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_CLIENT_ID!,
          "x-client-secret": process.env.CASHFREE_CLIENT_SECRET!,
          "x-api-version": "2023-08-01",
        },
      }
    );

    const data = await res.json();

    if (data.order_status === "PAID") {
      await db.collection("purchases").add({
        userId,
        courseId,
        orderId,
        amount: data.order_amount,
        paymentStatus: data.order_status,
        createdAt: new Date(),
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false });
  } catch (error) {
    console.error("Payment verification error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
