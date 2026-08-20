"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/rbac";
import { getCmsLocationFilter } from "@/lib/cms-rbac";
import { MemberStatus, MembershipTier } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendAdminNotification } from "@/lib/notifications";
import bcrypt from "bcryptjs";
import { z } from "zod";
import crypto from "crypto";

const createMemberSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  fatherName: z.string().optional(),
  gender: z.string(),
  dob: z.string(), // Assuming YYYY-MM-DD
  mobile: z.string(),
  state: z.string(),
  district: z.string(),
  taluka: z.string(),
  village: z.string().optional(),
  fullAddress: z.string().optional(),
  pincode: z.string().optional(),
  membershipType: z.nativeEnum(MembershipTier).optional(),
});

export async function getAdminMembers() {
  const session = await requireAdminAuth();
  const locationFilter = getCmsLocationFilter(session);

  return prisma.memberProfile.findMany({
    where: locationFilter,
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getAdminMemberById(memberId: string) {
  const session = await requireAdminAuth();
  const locationFilter = getCmsLocationFilter(session);

  const member = await prisma.memberProfile.findFirst({
    where: {
      AND: [
        { id: memberId },
        locationFilter
      ]
    },
    include: {
      user: true,
      membershipHistory: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!member) {
    throw new Error("Member not found or outside your jurisdiction.");
  }

  return member;
}

export async function updateMemberStatus(memberId: string, status: MemberStatus) {
  const session = await requireAdminAuth();
  const locationFilter = getCmsLocationFilter(session);

  // Validate jurisdiction
  const member = await prisma.memberProfile.findFirst({
    where: {
      AND: [
        { id: memberId },
        locationFilter
      ]
    }
  });

  if (!member) {
    throw new Error("Unauthorized: Member not in your jurisdiction");
  }

  const updated = await prisma.memberProfile.update({
    where: { id: memberId },
    data: { 
      status,
      approvedById: status === "ACTIVE" ? session.id : member.approvedById,
      membershipExpiry: status === "ACTIVE" && !member.membershipExpiry ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)) : member.membershipExpiry
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: session.id,
      action: "UPDATE_MEMBER_STATUS",
      details: `Updated member ${member.memberId} status to ${status}`,
    }
  });

  // Notify upper levels if needed, or notify member directly (omitted complex push logic for brevity, simulated below)
  if (status === "ACTIVE") {
    // Fire and forget notification
    sendAdminNotification(
      session.id, 
      "Member Approved", 
      `You approved member ${member.memberId}`,
      "MEMBER_APPROVAL",
      `/admin/members/${member.id}`
    ).catch(console.error);
  }

  revalidatePath(`/admin/members`);
  revalidatePath(`/admin/members/${memberId}`);
  
  return updated;
}

export async function searchMembers(query: string) {
  const session = await requireAdminAuth();
  const locationFilter = getCmsLocationFilter(session);

  if (!query || query.length < 3) return [];

  return prisma.memberProfile.findMany({
    where: {
      AND: [
        locationFilter,
        {
          OR: [
            { memberId: { contains: query, mode: "insensitive" } },
            { mobile: { contains: query } },
            { user: { is: { name: { contains: query, mode: "insensitive" } } } }
          ]
        }
      ]
    },
    include: { user: true },
    take: 10
  });
}

export async function createMemberByAdmin(data: any) {
  const session = await requireAdminAuth();
  
  // SECURITY (Phase 3): Validate data to prevent mass assignment (HIGH-010)
  const validatedData = createMemberSchema.parse(data);
  
  // Hash password
  const hashedPassword = await bcrypt.hash(validatedData.password, 10);
  
  // Generate unique Member ID
  const memberCount = await prisma.memberProfile.count();
  const memberId = `RAVP-${new Date().getFullYear()}-${String(memberCount + 1).padStart(6, '0')}`;

  // SECURITY: Cryptographically secure referral code (LOW-005)
  const secureReferralCode = `REF-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

  return prisma.$transaction(async (tx) => {
    // 1. Create User
    const user = await tx.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        emailVerified: true,
      }
    });

    // 2. Create Account with credentials
    await tx.account.create({
      data: {
        userId: user.id,
        providerId: "credentials",
        accountId: validatedData.email,
        provider: "credentials",
        password: hashedPassword,
      }
    });

    // 3. Create Member Profile
    const profile = await tx.memberProfile.create({
      data: {
        userId: user.id,
        memberId,
        fatherName: validatedData.fatherName || "",
        gender: validatedData.gender,
        dob: new Date(validatedData.dob),
        mobile: validatedData.mobile,
        state: validatedData.state,
        district: validatedData.district,
        taluka: validatedData.taluka,
        village: validatedData.village || "",
        fullAddress: validatedData.fullAddress || "",
        pincode: validatedData.pincode || "",
        status: "ACTIVE", // Auto approve since created by admin
        approvedById: session.id,
        membershipExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        membershipType: validatedData.membershipType || "PRIMARY",
        referralCode: secureReferralCode,
      }
    });

    return profile;
  });
}
