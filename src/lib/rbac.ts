import { AdminRole, MemberProfile } from "@prisma/client";
import { getAdminSession, AdminJwtPayload } from "./admin-auth";

/**
 * Checks if the logged-in admin has the required role or a higher role.
 * Super Admin > National > State > District > Taluka > Village
 */
export function hasRequiredRole(adminRole: AdminRole, requiredRole: AdminRole): boolean {
  const roleHierarchy: Record<AdminRole, number> = {
    SUPER_ADMIN: 100,
    NATIONAL_ADMIN: 80,
    STATE_ADMIN: 60,
    DISTRICT_ADMIN: 40,
    TALUKA_ADMIN: 20,
    VILLAGE_ADMIN: 10,
  };

  return roleHierarchy[adminRole] >= roleHierarchy[requiredRole];
}

/**
 * Validates if an admin can manage (create/edit/delete) another admin role.
 * They must be strictly higher in the hierarchy.
 */
export function canManageRole(adminRole: AdminRole, targetRole: AdminRole): boolean {
  const roleHierarchy: Record<AdminRole, number> = {
    SUPER_ADMIN: 100,
    NATIONAL_ADMIN: 80,
    STATE_ADMIN: 60,
    DISTRICT_ADMIN: 40,
    TALUKA_ADMIN: 20,
    VILLAGE_ADMIN: 10,
  };

  return roleHierarchy[adminRole] > roleHierarchy[targetRole];
}

/**
 * Generates the Prisma `where` clause for filtering Members
 * based on the admin's assigned location.
 */
export function getMemberLocationFilter(admin: AdminJwtPayload) {
  const where: Record<string, string> = {};

  if (admin.role === "SUPER_ADMIN" || admin.role === "NATIONAL_ADMIN") {
    return where; // Can see everyone
  }

  if (admin.state) {
    where.state = admin.state;
  }
  
  if (admin.role === "STATE_ADMIN") return where;

  if (admin.district) {
    where.district = admin.district;
  }

  if (admin.role === "DISTRICT_ADMIN") return where;

  if (admin.taluka) {
    where.taluka = admin.taluka;
  }

  if (admin.role === "TALUKA_ADMIN") return where;

  if (admin.village) {
    where.village = admin.village;
  }

  return where;
}

/**
 * Checks if an admin has access to a specific member record.
 */
export function hasMemberAccess(admin: AdminJwtPayload, member: MemberProfile): boolean {
  if (admin.role === "SUPER_ADMIN" || admin.role === "NATIONAL_ADMIN") {
    return true;
  }

  if (admin.role === "STATE_ADMIN") {
    return admin.state === member.state;
  }

  if (admin.role === "DISTRICT_ADMIN") {
    return admin.state === member.state && admin.district === member.district;
  }

  if (admin.role === "TALUKA_ADMIN") {
    return admin.state === member.state && admin.district === member.district && admin.taluka === member.taluka;
  }

  if (admin.role === "VILLAGE_ADMIN") {
    return admin.state === member.state && admin.district === member.district && admin.taluka === member.taluka && admin.village === member.village;
  }

  return false;
}

/**
 * Protects a server action by verifying the admin session and returning it.
 * Throws an error if unauthorized.
 */
export async function requireAdminAuth(requiredRole: AdminRole = "VILLAGE_ADMIN") {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized: Please log in as an Admin.");
  }

  if (!hasRequiredRole(session.role, requiredRole)) {
    throw new Error("Forbidden: You do not have permission to perform this action.");
  }

  return session;
}
