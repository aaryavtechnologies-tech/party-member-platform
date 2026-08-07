"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/rbac";
import { AdminRole } from "@prisma/client";

/**
 * Member joins or requests to join a community.
 */
export async function joinCommunity(communityId: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const memberProfile = await prisma.memberProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!memberProfile) {
    throw new Error("Member profile not found");
  }

  const community = await prisma.community.findUnique({
    where: { id: communityId }
  });

  if (!community) throw new Error("Community not found");

  // Check if already a member
  const existingMember = await prisma.communityMember.findUnique({
    where: {
      communityId_memberProfileId: {
        communityId,
        memberProfileId: memberProfile.id
      }
    }
  });

  if (existingMember) {
    return { success: true }; // Already joined
  }

  if (community.isPublic) {
    // Join directly
    await prisma.communityMember.create({
      data: {
        communityId,
        memberProfileId: memberProfile.id,
        role: "MEMBER"
      }
    });
  } else {
    // Check if already requested
    const existingRequest = await prisma.communityJoinRequest.findFirst({
      where: {
        communityId,
        memberProfileId: memberProfile.id,
        status: "PENDING"
      }
    });

    if (!existingRequest) {
      // Create join request
      await prisma.communityJoinRequest.create({
        data: {
          communityId,
          memberProfileId: memberProfile.id,
          status: "PENDING"
        }
      });
    }
  }

  revalidatePath("/dashboard/communities");
  return { success: true };
}

/**
 * Admin approves or rejects a join request
 */
export async function processJoinRequest(requestId: string, action: "APPROVE" | "REJECT") {
  const session = await requireAdminAuth();
  
  // Checking if Super or National
  if (session.role !== AdminRole.SUPER_ADMIN && session.role !== AdminRole.NATIONAL_ADMIN) {
    throw new Error("Unauthorized");
  }

  const request = await prisma.communityJoinRequest.findUnique({
    where: { id: requestId }
  });

  if (!request) throw new Error("Request not found");

  if (action === "APPROVE") {
    // Create member and update request
    await prisma.$transaction([
      prisma.communityMember.create({
        data: {
          communityId: request.communityId,
          memberProfileId: request.memberProfileId,
          role: "MEMBER"
        }
      }),
      prisma.communityJoinRequest.update({
        where: { id: requestId },
        data: { status: "APPROVED" }
      })
    ]);
  } else {
    // Reject request
    await prisma.communityJoinRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED" }
    });
  }

  revalidatePath(`/admin/communities/${request.communityId}`);
  return { success: true };
}
