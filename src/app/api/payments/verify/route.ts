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

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment parameters" },
        { status: 400 }
      );
    }

    // SECURITY: Find payment record FIRST and verify ownership before any signature check
    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    // SECURITY: Verify that this order belongs to the authenticated user
    // Prevents User A from claiming User B's payment
    if (payment.userId !== session.user.id) {
      console.warn(
        `[Payment Verify] SECURITY: User ${session.user.id} attempted to verify order belonging to ${payment.userId}. Order: ${razorpay_order_id}`
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // SECURITY: Prevent double-processing of already verified payments
    if (payment.status === "SUCCESS") {
      return NextResponse.json({ message: "Payment already verified successfully" });
    }

    // SECURITY: Verify Razorpay signature server-side
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    // SECURITY: Use timingSafeEqual to prevent timing attacks on signature comparison
    const sigBuffer = Buffer.from(razorpay_signature, "hex");
    const expectedBuffer = Buffer.from(expectedSign, "hex");
    
    const isValidSignature =
      sigBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(sigBuffer, expectedBuffer);

    if (isValidSignature) {
      // Update payment status + member profile atomically
      const memberProfile = await prisma.memberProfile.findUnique({
        where: { userId: session.user.id },
      });

      await prisma.$transaction(async (tx) => {
        // Mark payment as successful
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: "SUCCESS",
            razorpayPaymentId: razorpay_payment_id,
          },
        });

        // Update membership tier if profile exists
        if (memberProfile && payment.upgradeTo) {
          await tx.memberProfile.update({
            where: { id: memberProfile.id },
            data: { membershipType: payment.upgradeTo },
          });

          await tx.membershipHistory.create({
            data: {
              memberProfileId: memberProfile.id,
              fromTier: memberProfile.membershipType,
              toTier: payment.upgradeTo,
              amountPaid: payment.amount,
              paymentId: payment.id,
            },
          });
        }
      });

      return NextResponse.json({ message: "Payment verified successfully" });
    } else {
      // Signature mismatch — mark as failed
      console.warn(
        `[Payment Verify] Signature mismatch for order ${razorpay_order_id} by user ${session.user.id}`
      );
      await prisma.payment.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: { status: "FAILED", errorMessage: "Signature mismatch" },
      });
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    // SECURITY: Don't expose internal error details
    return NextResponse.json(
      { error: "Payment verification failed. Please contact support." },
      { status: 500 }
    );
  }
}
