// app/api/create-order/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      slug,
      courseId,
      fullName,
      email,
      phone,
      amount,
      userId
    } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid amount" },
        { status: 400 }
      );
    }

    if (!courseId) {
      return NextResponse.json(
        { success: false, message: "Missing courseId" },
        { status: 400 }
      );
    }

    const cashfreeBaseUrl =
      process.env.CASHFREE_ENV === "production"
        ? "https://api.cashfree.com"
        : "https://sandbox.cashfree.com";

    const orderId = `enroll_${Date.now()}`;

    const response = await fetch(`${cashfreeBaseUrl}/pg/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_CLIENT_ID!,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET!,
        "x-api-version": "2023-08-01"
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: Number(amount),
        order_currency: "INR",

        customer_details: {
          customer_id: userId,
          customer_name: fullName || "Student",
          customer_email: email || "student@email.com",
          customer_phone: phone || "9999999999"
        },

        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?order_id=${orderId}&courseId=${courseId}`,
          notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/cashfree-webhook`
        },

        order_note: `Course Enrollment ${slug || courseId}`
      })
    });

    const data = await response.json();

    console.log("Cashfree Order Response:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data?.message || "Failed to create order",
          debug: data
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      order_id: data.order_id,
      payment_session_id: data.payment_session_id,
      cf_order_id: data.cf_order_id
    });

  } catch (error) {
    console.error("Create order error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}