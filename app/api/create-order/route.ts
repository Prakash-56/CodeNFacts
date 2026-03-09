// app/api/create-order/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      slug,
      courseId,
      fullName: name,
      email,
      phone,
      amount,
      userId
    } = body;

    // Validate user
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required. Please sign in."
        },
        { status: 401 }
      );
    }

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing amount" },
        { status: 400 }
      );
    }

    // Validate courseId
    if (!courseId) {
      return NextResponse.json(
        { success: false, message: "Missing courseId" },
        { status: 400 }
      );
    }

    // ✅ Match environment for both create-order and verify-payment
    const cashfreeBaseUrl =
      process.env.CASHFREE_ENV === "production"
        ? "https://api.cashfree.com"
        : "https://sandbox.cashfree.com";

    // Generate unique order id
    const orderId = `enroll_${slug?.replace(/[^a-z0-9]/gi, "")}_${Date.now()}`;

    // Create order in Cashfree
    const cashfreeResponse = await fetch(
      `${cashfreeBaseUrl}/pg/orders`,
      {
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
            customer_name: name || "Student",
            customer_email: email || "student@example.com",
            customer_phone: phone || "9999999999"
          },

          order_meta: {
            // ✅ Include courseId in return_url
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?order_id={order_id}&courseId=${courseId}`,
            notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-payment`
          },

          order_note: `Enrollment for ${slug}`
        })
      }
    );

    const data = await cashfreeResponse.json();

    console.log("Cashfree Order Response:", data);

    if (!cashfreeResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to create order"
        },
        { status: cashfreeResponse.status }
      );
    }

    // Return response expected by frontend
    return NextResponse.json({
      success: true,
      order_id: data.order_id,
      payment_session_id: data.payment_session_id,
      cf_order_id: data.cf_order_id,
      amount: data.order_amount,
      status: data.order_status
    });

  } catch (error) {
    console.error("Create order error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error"
      },
      { status: 500 }
    );
  }
}