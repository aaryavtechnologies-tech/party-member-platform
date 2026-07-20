import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Find the payment record
      const payment = await prisma.payment.findUnique({
        where: { razorpayOrderId: razorpay_order_id },
      });

      if (!payment) {
        return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
      }

      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "SUCCESS",
          razorpayPaymentId: razorpay_payment_id,
        },
      });

      // Update Member Profile & Log History
      const memberProfile = await prisma.memberProfile.findUnique({
        where: { userId: session.user.id }
      });

      if (memberProfile) {
        await prisma.$transaction([
          prisma.memberProfile.update({
            where: { id: memberProfile.id },
            data: { membershipType: payment.upgradeTo }
          }),
          prisma.membershipHistory.create({
            data: {
              memberProfileId: memberProfile.id,
              fromTier: memberProfile.membershipType,
              toTier: payment.upgradeTo,
              amountPaid: payment.amount,
              paymentId: payment.id
            }
          })
        ]);
      }

      return NextResponse.json({ message: "Payment verified successfully" });
    } else {
      // Signature mismatch
      await prisma.payment.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: { status: "FAILED", errorMessage: "Signature mismatch" },
      });
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
