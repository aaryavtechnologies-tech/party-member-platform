import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendUserInquiryConfirmationEmail, sendAdminInquiryNotificationEmail } from "@/lib/email/contact-emails";
import { checkRateLimit } from "@/lib/rate-limiter";

const submitSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  mobileNumber: z.string().regex(/^[0-9]{10}$/, "Invalid 10-digit mobile number"),
  email: z.string().email("Invalid email address"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  taluka: z.string().min(1, "Taluka is required"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  website_url_hp: z.string().optional(), // Honeypot field
});

export async function POST(req: NextRequest) {
  // SECURITY: Rate limit contact form to 3 submissions per IP per 10 minutes
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateLimit = checkRateLimit("contact-form", ip, {
    maxRequests: 3,
    windowMs: 10 * 60 * 1000, // 10 minutes
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, message: "Too many submissions. Please wait before trying again." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds ?? 600) },
      }
    );
  }

  try {
    const body = await req.json();
    const result = submitSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Honeypot spam check: if honeypot field is filled, silently return success without saving
    if (data.website_url_hp && data.website_url_hp.trim() !== "") {
      return NextResponse.json({
        success: true,
        inquiryId: "INQ-2026-SPAM00",
        message: "Thank You! Your message has been submitted successfully.",
      });
    }

    // Generate Inquiry Reference Number
    const year = new Date().getFullYear();
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const inquiryId = `INQ-${year}-${randomNum}`;

    // Create DB Record
    const inquiry = await prisma.contactInquiry.create({
      data: {
        inquiryId,
        fullName: data.fullName,
        mobileNumber: data.mobileNumber,
        email: data.email,
        state: data.state,
        district: data.district,
        taluka: data.taluka,
        subject: data.subject,
        message: data.message,
        status: "NEW",
        priority: "MEDIUM",
        activityLogs: {
          create: {
            action: "CREATED",
            performedBy: "System (Public Contact Form)",
            remarks: "Inquiry submitted via online contact form.",
          },
        },
      },
    });

    const emailPayload = {
      inquiryId: inquiry.inquiryId,
      fullName: inquiry.fullName,
      mobileNumber: inquiry.mobileNumber,
      email: inquiry.email,
      state: inquiry.state,
      district: inquiry.district,
      taluka: inquiry.taluka,
      subject: inquiry.subject,
      message: inquiry.message,
      createdAt: inquiry.createdAt.toISOString(),
    };

    // Dispatch Async Emails (Non-blocking)
    sendUserInquiryConfirmationEmail(emailPayload).catch((err) =>
      console.error("User confirmation email failed:", err)
    );
    sendAdminInquiryNotificationEmail(emailPayload).catch((err) =>
      console.error("Admin notification email failed:", err)
    );

    return NextResponse.json({
      success: true,
      inquiryId: inquiry.inquiryId,
      message: "Thank You! Your message has been submitted successfully. Our team will contact you as soon as possible.",
    });
  } catch (error) {
    console.error("Error submitting contact inquiry:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
