"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function createOrganizationUnit(data: {
  nameEn: string;
  nameGu: string;
  levelName: string;
  parentId?: string;
}) {
  const session = await requireAdminAuth("STATE_ADMIN");

  const { nameEn, nameGu, levelName, parentId } = data;

  if (!nameEn || !nameGu || !levelName) {
    throw new Error("English Name, Gujarati Name, and Level are required.");
  }

  // Find the requested level
  let level = await prisma.organizationLevel.findFirst({
    where: { nameEn: { equals: levelName, mode: "insensitive" } }
  });

  // Automatically create the level if it doesn't exist (Seed safeguard)
  if (!level) {
    let priority = 0;
    const l = levelName.toLowerCase();
    if (l === "national") priority = 1;
    else if (l === "state") priority = 2;
    else if (l === "district") priority = 3;
    else if (l === "taluka") priority = 4;
    else if (l === "village") priority = 5;

    level = await prisma.organizationLevel.create({
      data: {
        nameEn: levelName.charAt(0).toUpperCase() + levelName.slice(1).toLowerCase(),
        nameGu: levelName, // Fallback
        priority,
      }
    });
  }

  // Create the Organization Unit
  const unit = await prisma.organizationUnit.create({
    data: {
      nameEn,
      nameGu,
      levelId: level.id,
      parentId: parentId || null,
      createdBy: session.id,
    }
  });

  revalidatePath(`/admin/organization/${levelName.toLowerCase()}`);
  return unit;
}

export async function createPosition(data: {
  nameEn: string;
  nameGu: string;
  priority: number;
}) {
  const session = await requireAdminAuth("STATE_ADMIN");

  const { nameEn, nameGu, priority } = data;

  if (!nameEn || !nameGu) {
    throw new Error("English Name and Gujarati Name are required.");
  }

  const position = await prisma.position.create({
    data: {
      nameEn,
      nameGu,
      priority,
      createdBy: session.id,
    }
  });

  revalidatePath("/admin/organization/positions");
  return position;
}

export async function assignOfficeBearer(data: {
  memberId: string;
  positionId: string;
  unitId: string;
}) {
  const session = await requireAdminAuth("STATE_ADMIN");

  const { memberId, positionId, unitId } = data;

  if (!memberId || !positionId || !unitId) {
    throw new Error("Member, Position, and Unit are required.");
  }

  // Optionally check if the member already holds a position in this unit

  const bearer = await prisma.officeBearer.create({
    data: {
      memberId,
      positionId,
      unitId,
      startDate: new Date(),
    }
  });

  revalidatePath(`/admin/organization/units/${unitId}`);
  return bearer;
}

export async function revokeOfficeBearer(id: string, unitId: string) {
  const session = await requireAdminAuth("STATE_ADMIN");

  await prisma.officeBearer.update({
    where: { id },
    data: {
      status: "REVOKED",
      endDate: new Date()
    }
  });

  revalidatePath(`/admin/organization/units/${unitId}`);
}
