"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hashPassword } from "@better-auth/utils/password";
import { sendEmail } from "@/lib/email/send-email";

const formSchema = z.object({
  firstName: z.string().min(2),
  middleName: z.string().optional(),
  lastName: z.string().min(2),
  relativeRelation: z.enum(["Father", "Husband"]),
  relativeFirstName: z.string().min(2),
  relativeMiddleName: z.string().optional(),
  relativeLastName: z.string().min(2),
  gender: z.string().min(1),
  dob: z.string().min(1).refine((date) => {
    const today = new Date();
    const dob = new Date(date);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age >= 18;
  }, "Must be at least 18 years old"),
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  email: z.string().email(),
  password: z.string().min(6),
  aadhaar: z.string().optional().or(z.literal("")),
  voterId: z.string().regex(/^[a-zA-Z0-9]{10,15}$/).optional().or(z.literal("")),
  state: z.string().min(2),
  district: z.string().min(2),
  taluka: z.string().min(2),
  village: z.string().min(2),
  fullAddress: z.string().min(10),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/),
  referralCode: z.string().optional(),
  profilePic: z.string().min(1),
});

type RegistrationData = z.infer<typeof formSchema>;

function generateMemberId() {
  // e.g. RAVP-2026-000001
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `RAVP-${year}-${randomNum}`;
}


export async function registerMember(data: RegistrationData) {
  try {
    const validatedData = formSchema.parse(data);

    // 1. Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return { success: false, error: "A user with this email already exists." };
    }

    // 2. Validate Referral Code if provided
    let referringMember = null;
    if (validatedData.referralCode) {
      referringMember = await prisma.memberProfile.findUnique({
        where: { referralCode: validatedData.referralCode.toUpperCase() }
      });

      if (!referringMember) {
        return { success: false, error: "Invalid Referral Code." };
      }
    }

    // 3. Create User and MemberProfile in a transaction
    const memberId = generateMemberId();

    const newUser = await prisma.$transaction(async (tx) => {
      // Create Base User
      const fullName = [validatedData.firstName, validatedData.middleName, validatedData.lastName]
        .filter(Boolean)
        .join(" ");

      const hashedPass = await hashPassword(validatedData.password);

      const user = await tx.user.create({
        data: {
          name: fullName,
          email: validatedData.email,
          emailVerified: true, // Auto-verified for this flow context
          accounts: {
            create: {
              accountId: validatedData.email,
              providerId: "credential",
              provider: "credential",
              password: hashedPass
            }
          }
        }
      });

      // Generate Sequential Referral Code
      const lastProfile = await tx.memberProfile.findFirst({
        where: {
          referralCode: {
            startsWith: "RAVP0"
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      let nextRefNumber = 1;
      if (lastProfile) {
        const lastNumberStr = lastProfile.referralCode.replace("RAVP", "");
        const lastNumber = parseInt(lastNumberStr, 10);
        if (!isNaN(lastNumber)) {
          nextRefNumber = lastNumber + 1;
        }
      }
      const referralCode = `RAVP${nextRefNumber.toString().padStart(16, "0")}`;

      const fullFatherName = `${validatedData.relativeRelation}: ${validatedData.relativeFirstName} ${validatedData.relativeMiddleName ? validatedData.relativeMiddleName + ' ' : ''}${validatedData.relativeLastName}`.trim();

      // Create MemberProfile
      const profile = await tx.memberProfile.create({
        data: {
          userId: user.id,
          memberId,
          referralCode,
          fatherName: fullFatherName,
          gender: validatedData.gender,
          dob: new Date(validatedData.dob),
          mobile: validatedData.mobile,
          aadhaar: validatedData.aadhaar,
          voterId: validatedData.voterId,
          state: validatedData.state,
          district: validatedData.district,
          taluka: validatedData.taluka,
          village: validatedData.village,
          fullAddress: validatedData.fullAddress,
          pincode: validatedData.pincode,
          profilePic: validatedData.profilePic,
          referredById: referringMember?.id || null,
        }
      });

      // If referred, log in ReferralHistory
      if (referringMember) {
        await tx.referralHistory.create({
          data: {
            referrerId: referringMember.id,
            referredId: profile.id,
            status: "SUCCESS"
          }
        });
      }

      return { user, profile };
    });

    return { success: true, memberId: newUser.profile.memberId };

  } catch (error: any) {
    console.error("Registration Error:", error);
    
    // Handle Prisma Unique Constraint Violations
    if (error.code === 'P2002') {
      const target = error.meta?.target;
      if (Array.isArray(target)) {
        if (target.includes('mobile')) {
          return { success: false, error: "This mobile number is already registered to another member." };
        }
        if (target.includes('aadhaar')) {
          return { success: false, error: "This Aadhaar number is already registered." };
        }
        if (target.includes('voterId')) {
          return { success: false, error: "This Voter ID is already registered." };
        }
      }
      return { success: false, error: "A record with this information already exists." };
    }
    
    return { success: false, error: "Something went wrong during registration. Please check your details." };
  }
}

export async function sendRegistrationOtp(email: string) {
  try {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "A user with this email already exists." };
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Save to Verification table (expires in 5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    
    // Delete any existing OTP for this email to prevent clutter
    await prisma.verification.deleteMany({ where: { identifier: email } });
    
    await prisma.verification.create({
      data: {
        identifier: email,
        value: otp,
        expiresAt
      }
    });

    // SECURITY: Do NOT log OTP values — they are authentication secrets

    // 4. Send email using unified sendEmail helper (supports SMTP & Resend)
    const emailResult = await sendEmail({
      to: email,
      subject: "Your OTP Verification Code – RAVP",
      html: `<div style="font-family:sans-serif;max-width:480px;margin:auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background-color:#FF9933;padding:24px;text-align:center;">
          <h2 style="color:#ffffff;margin:0;font-size:24px;font-weight:bold;">Rashtriya Annadata Vikas Party</h2>
          <h3 style="color:#ffffff;margin:8px 0 0 0;font-size:20px;font-weight:bold;">રાષ્ટ્રીય અન્નદાતા વિકાસ પાર્ટી</h3>
        </div>
        <div style="padding:24px;background-color:#ffffff;color:#333333;">
          <p style="font-size:16px;line-height:1.5;margin-top:0;">
            Your one-time password (OTP) for verification is:
          </p>
          <p style="font-size:16px;line-height:1.5;margin-top:0;">
            ચકાસણી માટે તમારો વન-ટાઇમ પાસવર્ડ (OTP) છે:
          </p>
          <div style="font-size:40px;font-weight:bold;letter-spacing:12px;color:#000080;background:#f3f4f6;padding:24px;border-radius:8px;text-align:center;margin:32px 0;border:2px dashed #000080;">
            ${otp}
          </div>
          <p style="font-size:14px;color:#666666;line-height:1.5;text-align:center;">
            This OTP will expire in <strong>5 minutes</strong>.<br />
            (આ OTP <strong>5 મિનિટમાં</strong> સમાપ્ત થશે.)
          </p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
          <p style="color:#9ca3af;font-size:12px;margin:0;">
            If you did not request this, please ignore this email. (જો તમે આ વિનંતી કરી નથી, તો કૃપા કરીને આ ઇમેઇલની અવગણના કરો.)
          </p>
        </div>
      </div>`,
    });

    if (!emailResult.success) {
      console.error("[sendRegistrationOtp] Email Delivery Error:", emailResult.error);
      return { success: false, error: emailResult.error || "Failed to send OTP email. Please verify your email configuration." };
    }

    console.log(`[Registration] Successfully sent OTP to ${email}`);
    return { success: true };
  } catch (error: any) {
    console.error("[sendRegistrationOtp] Exception:", error);
    return { success: false, error: "Failed to send OTP. Please try again later." };
  }
}

export async function verifyRegistrationOtp(email: string, otp: string) {
  try {
    const verification = await prisma.verification.findFirst({
      where: {
        identifier: email,
        value: otp
      }
    });

    if (!verification) {
      return { success: false, error: "Invalid OTP." };
    }

    if (verification.expiresAt < new Date()) {
      return { success: false, error: "OTP has expired." };
    }

    // OTP is valid, delete it so it can't be reused
    await prisma.verification.delete({
      where: { id: verification.id }
    });

    return { success: true };
  } catch (error: any) {
    console.error("OTP Verification Error:", error);
    return { success: false, error: "Failed to verify OTP." };
  }
}

export async function checkStep1Availability(data: {
  email?: string;
  mobile?: string;
  aadhaar?: string;
  voterId?: string;
}) {
  try {
    if (data.email && data.email.trim()) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email.trim().toLowerCase() },
      });
      if (existingUser) {
        return {
          available: false,
          field: "email",
          error: "A user with this email address is already registered.",
        };
      }
    }

    if (data.mobile && data.mobile.trim()) {
      const existingMobile = await prisma.memberProfile.findFirst({
        where: { mobile: data.mobile.trim() },
      });
      if (existingMobile) {
        return {
          available: false,
          field: "mobile",
          error: "This mobile number is already registered to another member.",
        };
      }
    }

    if (data.aadhaar && data.aadhaar.trim().length > 0) {
      const existingAadhaar = await prisma.memberProfile.findFirst({
        where: { aadhaar: data.aadhaar.trim() },
      });
      if (existingAadhaar) {
        return {
          available: false,
          field: "aadhaar",
          error: "This Aadhaar number is already registered.",
        };
      }
    }

    if (data.voterId && data.voterId.trim().length > 0) {
      const existingVoter = await prisma.memberProfile.findFirst({
        where: { voterId: data.voterId.trim().toUpperCase() },
      });
      if (existingVoter) {
        return {
          available: false,
          field: "voterId",
          error: "This Voter ID is already registered.",
        };
      }
    }

    return { available: true };
  } catch (error: any) {
    console.error("[checkStep1Availability] Exception:", error);
    return { available: true };
  }
}

export async function deleteMemberAction(profileId: string) {
  // SECURITY: Require SUPER_ADMIN authorization — was completely missing
  const { requireAdminAuth } = await import("@/lib/rbac");
  const adminSession = await requireAdminAuth("NATIONAL_ADMIN");
  
  if (!adminSession) {
    return { success: false, error: "Unauthorized." };
  }

  try {
    const profile = await prisma.memberProfile.findUnique({
      where: { id: profileId },
      select: { id: true, userId: true, memberId: true }
    });

    if (!profile) {
      return { success: false, error: "Member profile not found." };
    }

    // Delete base User record (cascades to MemberProfile, Session, Account, etc.)
    await prisma.user.delete({
      where: { id: profile.userId }
    });

    console.log(`[deleteMemberAction] Admin ${adminSession.id} (${adminSession.role}) deleted member ${profile.memberId}`);
    return { success: true };
  } catch (error: any) {
    console.error("[deleteMemberAction] Exception:", error);
    // SECURITY: Don't expose internal error messages to client
    return { success: false, error: "Failed to delete member. Please try again." };
  }
}

