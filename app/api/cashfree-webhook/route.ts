import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Cashfree Webhook Received:", JSON.stringify(body));

    const eventType = body?.type;

    // Ignore other events but still return 200
    if (eventType !== "PAYMENT_SUCCESS_WEBHOOK") {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const payment = body?.data?.payment;
    const order = body?.data?.order;

    if (!payment || !order) {
      console.error("Invalid webhook payload");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const orderId = payment.order_id;
    const paymentId = payment.cf_payment_id;
    const amount = payment.payment_amount;
    const status = payment.payment_status;

    const userId = order?.order_tags?.userId;
    const courseId = order?.order_tags?.courseId;

    if (!userId || !courseId) {
      console.error("Missing order_tags");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const purchaseId = `${userId}_${courseId}`;

    const purchaseRef = db.collection("purchases").doc(purchaseId);
    const existingPurchase = await purchaseRef.get();

    if (existingPurchase.exists) {
      console.log("Purchase already exists:", purchaseId);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    await purchaseRef.set({
      userId,
      courseId,
      orderId,
      paymentId,
      amount,
      status,
      createdAt: new Date(),
    });

    await db.collection("users").doc(userId).set(
      {
        purchasedCourses: FieldValue.arrayUnion(courseId),
      },
      { merge: true }
    );

    console.log("Course unlocked:", purchaseId);

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);

    // Always return 200 so Cashfree doesn't retry endlessly
    return NextResponse.json({ received: true }, { status: 200 });
  }
}