"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hashPassword } from "@better-auth/utils/password";

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
