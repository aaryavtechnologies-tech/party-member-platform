"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Fetch all communities for admins.
 */
export async function getAdminCommunities() {
  return prisma.community.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { members: true, posts: true }
      }
    }
  });
}

/**
 * Fetch public communities and communities the member has joined.
 */
export async function getMemberCommunities() {
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

  return prisma.community.findMany({
    where: {
      OR: [
        { isPublic: true },
        { members: { some: { memberProfileId: memberProfile.id } } }
      ]
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { members: true } },
      members: {
        where: { memberProfileId: memberProfile.id },
        take: 1
      },
      joinRequests: {
        where: { memberProfileId: memberProfile.id },
        take: 1
      }
    }
  });
}

/**
 * Fetch a specific community details (posts, members).
 */
export async function getCommunityDetails(communityId: string) {
  return prisma.community.findUnique({
    where: { id: communityId },
    include: {
      _count: { select: { members: true } },
      members: {
        include: {
          memberProfile: {
            include: { user: true }
          }
        }
      }
    }
  });
}

/**
 * Fetch Posts for a community
 */
export async function getCommunityPosts(communityId: string) {
  return prisma.communityPost.findMany({
    where: { communityId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { comments: true } }
    }
  });
}

/**
 * Fetch Join Requests for Admin
 */
export async function getCommunityJoinRequests(communityId: string) {
  return prisma.communityJoinRequest.findMany({
    where: { communityId, status: "PENDING" },
    include: {
      memberProfile: {
        include: { user: true }
      }
    },
    orderBy: { requestedAt: "desc" }
  });
}
