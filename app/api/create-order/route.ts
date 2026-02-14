import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { amount, userId, courseId } = await req.json();

  const orderId = `order_${Date.now()}`;

  const res = await fetch("https://sandbox.cashfree.com/pg/orders", {
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
        customer_email: "user@example.com",
        customer_phone: "9999999999",
      },
    }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
