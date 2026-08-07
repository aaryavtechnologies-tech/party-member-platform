// src/lib/membership-check.ts

export const MEMBERSHIP_GRACE_PERIOD_DAYS = 0; // Changed to 0 for testing/immediate locking

/**
 * Checks if a member profile has an active membership or is within the grace period.
 * @param createdAt The creation date of the MemberProfile.
 * @param hasSuccessfulPayment Whether they have a successful payment on record.
 * @param currentTier The member's current tier (e.g. PRIMARY, LIFETIME_PRIMARY, LIFETIME_ACTIVE)
 * @param requiredTier The minimum required tier for the feature (e.g. LIFETIME_ACTIVE)
 * @returns boolean True if they can access locked features, False if they must pay.
 */
export function isMembershipActiveOrInGracePeriod(
  createdAt: Date,
  hasSuccessfulPayment: boolean,
  currentTier: string = "PRIMARY",
  requiredTier: string | null = null
): boolean {
  
  // Strict tier check if requested
  if (requiredTier === "LIFETIME_ACTIVE" && currentTier !== "LIFETIME_ACTIVE") {
    return false; // They MUST upgrade to 1000 plan
  }

  // General check: if they have any successful payment, they are good for basic features
  if (hasSuccessfulPayment) {
    return true; 
  }

  const now = new Date();
  const createdDate = new Date(createdAt);
  
  // Calculate difference in days
  const timeDiff = now.getTime() - createdDate.getTime();
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  // If within the grace period, they can still access features
  return diffDays <= MEMBERSHIP_GRACE_PERIOD_DAYS;
}
