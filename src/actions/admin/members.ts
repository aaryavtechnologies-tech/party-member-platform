"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/rbac";
import { getCmsLocationFilter } from "@/lib/cms-rbac";
import { MemberStatus, MembershipTier } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendAdminNotification } from "@/lib/notifications";
import bcrypt from "bcryptjs";

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
  
  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  // Generate unique Member ID
  const memberCount = await prisma.memberProfile.count();
  const memberId = `RAVP-${new Date().getFullYear()}-${String(memberCount + 1).padStart(6, '0')}`;

  return prisma.$transaction(async (tx) => {
    // 1. Create User
    const user = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        emailVerified: true,
      }
    });

    // 2. Create Account with credentials
    await tx.account.create({
      data: {
        userId: user.id,
        providerId: "credentials",
        accountId: data.email,
        provider: "credentials",
        password: hashedPassword,
      }
    });

    // 3. Create Member Profile
    const profile = await tx.memberProfile.create({
      data: {
        userId: user.id,
        memberId,
        fatherName: data.fatherName || "",
        gender: data.gender,
        dob: new Date(data.dob),
        mobile: data.mobile,
        state: data.state,
        district: data.district,
        taluka: data.taluka,
        village: data.village,
        fullAddress: data.fullAddress || "",
        pincode: data.pincode || "",
        status: "ACTIVE", // Auto approve since created by admin
        approvedById: session.id,
        membershipExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        membershipType: data.membershipType || "PRIMARY",
        referralCode: `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      }
    });

    return profile;
  });
}
