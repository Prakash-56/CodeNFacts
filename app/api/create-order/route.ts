import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, courseId, amount, email, phone } = await req.json();

    if (!userId || !courseId || !amount) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    const orderId = `CNF_${Date.now()}`;

    const baseUrl =
      process.env.CASHFREE_ENV === "production"
        ? "https://api.cashfree.com/pg/orders"
        : "https://sandbox.cashfree.com/pg/orders";

    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_CLIENT_ID!,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET!,
        "x-api-version": "2023-08-01",
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",

        customer_details: {
          customer_id: userId,
          customer_email: email || "student@email.com",
          customer_phone: phone || "9999999999",
        },

        // VERY IMPORTANT for webhook
        order_tags: {
          userId: userId,
          courseId: courseId,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cashfree error:", data);

      return NextResponse.json(
        { error: data?.message || "Cashfree order creation failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Create Order Error:", error);

    return NextResponse.json(
      { error: "Server error creating order" },
      { status: 500 }
    );
  }
}