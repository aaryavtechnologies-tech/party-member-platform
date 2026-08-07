// src/actions/public/organization.ts

import { prisma } from "@/lib/prisma";
import { AdminRole, MemberStatus } from "@prisma/client";

/**
 * Fetch admins filtered by role and optional location.
 */
export async function getAdminsByRole(
  role: AdminRole,
  location?: {
    state?: string;
    district?: string;
    taluka?: string;
    village?: string;
  }
) {
  const where: any = { role };
  if (location) {
    if (location.state) where.state = location.state;
    if (location.district) where.district = location.district;
    if (location.taluka) where.taluka = location.taluka;
    if (location.village) where.village = location.village;
  }
  return prisma.admin.findMany({
    where,
    select: {
      id: true,
      fullName: true,
      role: true,
      profilePhoto: true,
      state: true,
      district: true,
      taluka: true,
      village: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Count active members for a given location.
 */
export async function countMembersByLocation(location: {
  state?: string;
  district?: string;
  taluka?: string;
  village?: string;
}) {
  const where: any = { status: "ACTIVE" as MemberStatus };
  if (location.state) where.state = location.state;
  if (location.district) where.district = location.district;
  if (location.taluka) where.taluka = location.taluka;
  if (location.village) where.village = location.village;
  return prisma.memberProfile.count({ where });
}

/**
 * Get up to 100 random active members, optionally filtered by location.
 */
export async function getMembers(params?: {
  state?: string;
  district?: string;
  taluka?: string;
  village?: string;
  limit?: number;
}) {
  const limit = params?.limit ?? 100;
  const members = await prisma.$queryRaw<any>(`
    SELECT "id", "fullName", "profilePic", "state", "district", "taluka", "village", "memberId", "dob"
    FROM "MemberProfile"
    WHERE "status" = 'ACTIVE'
    ${params?.state ? `AND "state" = $1` : ''}
    ${params?.district ? `AND "district" = $2` : ''}
    ${params?.taluka ? `AND "taluka" = $3` : ''}
    ${params?.village ? `AND "village" = $4` : ''}
    ORDER BY RANDOM()
    LIMIT $5
  `, ...(params?.state ? [params.state] : []), ...(params?.district ? [params.district] : []), ...(params?.taluka ? [params.taluka] : []), ...(params?.village ? [params.village] : []), limit);

  return members.map((m: any) => {
    const age = Math.floor((Date.now() - new Date(m.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    return {
      id: m.id,
      fullName: m.fullName,
      profilePic: m.profilePic,
      location: `${m.state} - ${m.district} - ${m.taluka} - ${m.village}`.replace(/ - null/g, ""),
      memberId: m.memberId,
      age,
    };
  });
}
