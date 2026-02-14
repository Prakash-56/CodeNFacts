import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { orderId, userId, courseId } = await req.json();

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
    await supabase.from("purchases").insert({
      user_id: userId,
      course_id: courseId,
      order_id: orderId,
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false });
}
