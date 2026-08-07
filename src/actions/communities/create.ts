"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { AdminRole } from "@prisma/client";

/**
 * Super Admin or National Admin can create communities.
 */
export async function createCommunity(data: {
  name: string;
  description: string;
  logoUrl?: string;
  isPublic: boolean;
}) {
  const session = await requireAdminAuth();
  
  // Only SuperAdmin or NationalAdmin can create
  if (session.role !== AdminRole.SUPER_ADMIN && session.role !== AdminRole.NATIONAL_ADMIN) {
    throw new Error("Only Super Admin or National Admin can create communities.");
  }

  const { name, description, logoUrl, isPublic } = data;

  if (!name) {
    throw new Error("Community name is required.");
  }

  const community = await prisma.community.create({
    data: {
      name,
      description,
      logoUrl,
      isPublic,
      createdById: session.id,
    }
  });

  revalidatePath("/admin/communities");
  return { success: true, community };
}

/**
 * Admins delete a community
 */
export async function deleteCommunity(communityId: string) {
  const session = await requireAdminAuth();
  
  if (session.role !== AdminRole.SUPER_ADMIN && session.role !== AdminRole.NATIONAL_ADMIN) {
    throw new Error("Unauthorized to delete community.");
  }

  await prisma.community.delete({
    where: { id: communityId }
  });

  revalidatePath("/admin/communities");
  return { success: true };
}
