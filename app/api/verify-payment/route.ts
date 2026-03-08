// app/api/verify-payment/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import admin from "firebase-admin";

export async function POST(req: Request) {
  try {

    const { orderId, userId, courseId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    if (!orderId || !courseId) {
      return NextResponse.json(
        { success: false, message: "Missing orderId or courseId" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.cashfree.com/pg/orders/${orderId}/payments`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_CLIENT_ID!,
          "x-client-secret": process.env.CASHFREE_CLIENT_SECRET!,
          "x-api-version": "2023-08-01",
        },
      }
    );

    const payments = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 }
      );
    }

    const successfulPayment = Array.isArray(payments)
      ? payments.find(
          (p: any) =>
            p.payment_status === "SUCCESS" ||
            p.payment_status === "SUCCESSFUL" ||
            p.payment_status === "CAPTURED"
        )
      : null;

    if (!successfulPayment) {
      return NextResponse.json(
        { success: false, message: "Payment not completed" },
        { status: 402 }
      );
    }

    const purchaseId = `${userId}_${courseId}`;

    // ✅ Save purchase
    await db.collection("purchases").doc(purchaseId).set({
      userId,
      courseId,
      orderId,
      paymentId: successfulPayment.cf_payment_id,
      amount: successfulPayment.order_amount,
      status: successfulPayment.payment_status,
      createdAt: new Date(),
    });

    // ✅ Update user's purchasedCourses
    await db.collection("users").doc(userId).set(
      {
        purchasedCourses: admin.firestore.FieldValue.arrayUnion(courseId),
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      message: "Payment verified & course enrolled",
    });

  } catch (error) {

    console.error("Verify Payment Error:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );

  }
}