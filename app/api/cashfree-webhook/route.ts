import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Cashfree Webhook Received:", JSON.stringify(body, null, 2));

    const eventType = body?.type;

    // Only process successful payment events
    if (eventType !== "PAYMENT_SUCCESS_WEBHOOK") {
      console.log("Ignored event:", eventType);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const payment = body?.data?.payment;
    const order = body?.data?.order;

    if (!payment || !order) {
      console.error("Invalid webhook payload structure");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    if (payment.payment_status !== "SUCCESS") {
      console.log("Payment status not SUCCESS:", payment.payment_status);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const orderId = order.order_id;
    const paymentId = payment.cf_payment_id;
    const amount = payment.payment_amount;

    const userId = order?.order_tags?.userId;
    const courseId = order?.order_tags?.courseId;

    if (!userId || !courseId) {
      console.error("Missing order_tags userId or courseId");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const purchaseId = `${userId}_${courseId}`;

    console.log("Processing purchase:", purchaseId);

    const purchaseRef = db.collection("purchases").doc(purchaseId);

    const existingPurchase = await purchaseRef.get();

    // Prevent duplicate unlocks
    if (existingPurchase.exists) {
      console.log("Purchase already exists:", purchaseId);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    try {
      // Save purchase
      await purchaseRef.set({
        userId,
        courseId,
        orderId,
        paymentId,
        amount,
        status: "SUCCESS",
        createdAt: FieldValue.serverTimestamp(),
      });

      console.log("Purchase saved in Firestore:", purchaseId);

      // Unlock course for user
      await db.collection("users").doc(userId).set(
        {
          purchasedCourses: FieldValue.arrayUnion(courseId),
        },
        { merge: true }
      );

      console.log("Course unlocked for user:", userId);

    } catch (firestoreError: any) {
      console.error("Firestore write failed:", firestoreError?.message);
      console.error("Full Firestore error:", firestoreError);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error("Webhook Error message:", error?.message);
    console.error("Webhook Error stack:", error?.stack);
    console.error("Webhook Error full:", error);

    return NextResponse.json({ received: true }, { status: 200 });
  }
}