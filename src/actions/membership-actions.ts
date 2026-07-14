"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const formSchema = z.object({
  fullName: z.string().min(3),
  fatherName: z.string().min(3),
  gender: z.string().min(1),
  dob: z.string().min(1),
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  email: z.string().email(),
  aadhaar: z.string().optional().or(z.literal("")),
  voterId: z.string().optional().or(z.literal("")),
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

function generateReferralCode() {
  // e.g. RAVP458963
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `RAVP${randomNum}`;
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
    const referralCode = generateReferralCode();

    const newUser = await prisma.$transaction(async (tx) => {
      // Create Base User
      const user = await tx.user.create({
        data: {
          name: validatedData.fullName,
          email: validatedData.email,
          emailVerified: true, // Auto-verified for this flow context
        }
      });

      // Create MemberProfile
      const profile = await tx.memberProfile.create({
        data: {
          userId: user.id,
          memberId,
          referralCode,
          fatherName: validatedData.fatherName,
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
    return { success: false, error: error.message || "Something went wrong during registration." };
  }
}
