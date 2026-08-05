"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/rbac";
import { getCmsLocationFilter } from "@/lib/cms-rbac";
import { MemberStatus, MembershipTier } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { sendAdminNotification } from "@/lib/notifications";

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
