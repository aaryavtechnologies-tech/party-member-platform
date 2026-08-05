import { AdminRole, ArticleStatus } from "@prisma/client";
import { AdminJwtPayload } from "./admin-auth";

/**
 * Returns Prisma `where` clause to filter content (News, Gallery, Media) 
 * strictly based on the admin's assigned location.
 */
export function getCmsLocationFilter(admin: AdminJwtPayload) {
  const where: Record<string, string> = {};

  if (admin.role === "SUPER_ADMIN" || admin.role === "NATIONAL_ADMIN") {
    return where; // Can see everyone's content
  }

  if (admin.state) where.state = admin.state;
  if (admin.role === "STATE_ADMIN") return where;

  if (admin.district) where.district = admin.district;
  if (admin.role === "DISTRICT_ADMIN") return where;

  if (admin.taluka) where.taluka = admin.taluka;
  if (admin.role === "TALUKA_ADMIN") return where;

  if (admin.village) where.village = admin.village;
  return where;
}

/**
 * Checks if the Admin is allowed to mark content as "Breaking News"
 */
export function canMarkBreaking(role: AdminRole): boolean {
  return role === "SUPER_ADMIN" || role === "NATIONAL_ADMIN";
}

/**
 * Checks if the Admin is allowed to mark content as "Featured"
 */
export function canMarkFeatured(role: AdminRole): boolean {
  // State Admins can feature within their state context, but for global featuring, 
  // we restrict it to SUPER and NATIONAL as per requirements.
  return role === "SUPER_ADMIN" || role === "NATIONAL_ADMIN" || role === "STATE_ADMIN";
}

/**
 * Validates the Publishing Workflow.
 * Village/Taluka cannot publish. District can only submit for approval.
 * State approves District, National approves State. Super approves all.
 */
export function determineStatusOnSubmit(role: AdminRole, requestedStatus: ArticleStatus, isEditingOwn: boolean): ArticleStatus {
  if (requestedStatus === "DRAFT") return "DRAFT";

  if (requestedStatus === "PUBLISHED") {
    if (role === "SUPER_ADMIN") return "PUBLISHED";
    if (role === "NATIONAL_ADMIN") return "PUBLISHED"; // National admin can publish directly
    
    // State admins can publish directly, or they approve district news
    if (role === "STATE_ADMIN") return "PUBLISHED";
    
    // District, Taluka, Village must go through pending approval
    return "PENDING_APPROVAL";
  }

  return requestedStatus;
}

/**
 * Check if the current admin is allowed to approve content created by another role
 */
export function canApproveContent(approverRole: AdminRole, creatorRole: string | null): boolean {
  if (approverRole === "SUPER_ADMIN") return true;
  if (approverRole === "NATIONAL_ADMIN" && creatorRole !== "SUPER_ADMIN") return true;
  if (approverRole === "STATE_ADMIN" && (creatorRole === "DISTRICT_ADMIN" || creatorRole === "TALUKA_ADMIN" || creatorRole === "VILLAGE_ADMIN")) return true;
  return false;
}
