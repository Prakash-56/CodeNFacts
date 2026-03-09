import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

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

    // ✅ Match whichever env your create-order uses
    const cashfreeBaseUrl =
      process.env.CASHFREE_ENV === "production"
        ? "https://api.cashfree.com"
        : "https://sandbox.cashfree.com";

    const response = await fetch(
      `${cashfreeBaseUrl}/pg/orders/${orderId}/payments`,
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

    // ✅ Log so you can debug in Vercel logs
    console.log("Cashfree payments response:", JSON.stringify(payments));

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: payments?.message || "Payment verification failed" },
        { status: 400 }
      );
    }

    // ✅ Handle both array AND single object response from Cashfree
    const paymentsArray = Array.isArray(payments) ? payments : [payments];

    const successfulPayment = paymentsArray.find(
      (p: any) =>
        p.payment_status === "SUCCESS" ||
        p.payment_status === "SUCCESSFUL" ||
        p.payment_status === "CAPTURED"
    );

    if (!successfulPayment) {
      console.log(
        "No successful payment. Statuses:",
        paymentsArray.map((p: any) => p.payment_status)
      );
      return NextResponse.json(
        { success: false, message: "Payment not completed" },
        { status: 402 }
      );
    }

    const purchaseId = `${userId}_${courseId}`;

    await db.collection("purchases").doc(purchaseId).set({
      userId,
      courseId,
      orderId,
      paymentId: successfulPayment.cf_payment_id,
      amount: successfulPayment.order_amount,
      status: successfulPayment.payment_status,
      createdAt: new Date(),
    });

    // ✅ Fixed FieldValue import
    await db.collection("users").doc(userId).set(
      { purchasedCourses: FieldValue.arrayUnion(courseId) },
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

