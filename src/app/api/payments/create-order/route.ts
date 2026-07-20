import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MembershipTier } from "@prisma/client";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tier } = await req.json();

    let amount = 0;
    if (tier === MembershipTier.LIFETIME_PRIMARY) {
      amount = 100 * 100; // ₹100 in paise
    } else if (tier === MembershipTier.LIFETIME_ACTIVE) {
      amount = 1000 * 100; // ₹1000 in paise
    } else {
      return NextResponse.json({ error: "Invalid membership tier" }, { status: 400 });
    }

    const options = {
      amount: amount.toString(),
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save order details to the database (Payment table)
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        razorpayOrderId: order.id,
        amount: amount,
        status: "PENDING",
        upgradeTo: tier,
      },
    });

    return NextResponse.json({ orderId: order.id, amount, currency: "INR" });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Error creating order" },
      { status: 500 }
    );
  }
}
