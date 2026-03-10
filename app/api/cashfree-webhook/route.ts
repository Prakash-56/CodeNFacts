import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Cashfree Webhook:", JSON.stringify(body));

    const eventType = body.type;

    if (eventType !== "PAYMENT_SUCCESS_WEBHOOK") {
      return NextResponse.json({ received: true });
    }

    const payment = body?.data?.payment;
    const order = body?.data?.order;

    if (!payment || !order) {
      return NextResponse.json(
        { success: false, message: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    const orderId = payment.order_id;
    const paymentId = payment.cf_payment_id;
    const amount = payment.payment_amount;
    const status = payment.payment_status;

    const userId = order?.order_tags?.userId;
    const courseId = order?.order_tags?.courseId;

    if (!userId || !courseId) {
      return NextResponse.json(
        { success: false, message: "Missing order tags" },
        { status: 400 }
      );
    }

    const purchaseId = `${userId}_${courseId}`;

    const existingPurchase = await db
      .collection("purchases")
      .doc(purchaseId)
      .get();

    if (existingPurchase.exists) {
      return NextResponse.json({
        success: true,
        message: "Purchase already recorded",
      });
    }

    await db.collection("purchases").doc(purchaseId).set({
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

    return NextResponse.json({
      success: true,
      message: "Course unlocked via webhook",
    });

  } catch (error) {
    console.error("Webhook Error:", error);

    return NextResponse.json(
      { success: false, message: "Webhook server error" },
      { status: 500 }
    );
  }
}