import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { getMemberCommunities } from "@/actions/communities/fetch";
import MemberCommunitiesClient from "./MemberCommunitiesClient";
import { FeatureLock } from "@/components/shared/FeatureLock";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isMembershipActiveOrInGracePeriod } from "@/lib/membership-check";
import { redirect } from "next/navigation";

export default async function MemberCommunitiesPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) {
    redirect("/membership/login");
  }

  const memberProfile = await prisma.memberProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: {
        include: {
          payments: {
            where: { status: "SUCCESS" }
          }
        }
      }
    }
  });

  if (!memberProfile) {
    redirect("/dashboard/membership");
  }

  // Check if member has paid or is within 30 days AND meets tier
  const hasSuccessfulPayment = memberProfile.user.payments.length > 0;
  const canAccess = isMembershipActiveOrInGracePeriod(
    memberProfile.createdAt, 
    hasSuccessfulPayment, 
    memberProfile.membershipType, 
    "LIFETIME_ACTIVE"
  );

  // Fetch communities only if they can access (optimization)
  const communities = canAccess ? await getMemberCommunities() : [];

  return (
    <FeatureLock isPaidOrInGracePeriod={canAccess} requiredTier="LIFETIME_ACTIVE">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Communities
          </h1>
          <p className="text-slate-500">
            Join and interact with communities.
          </p>
        </div>
        
        <MemberCommunitiesClient initialCommunities={communities} memberProfileId={memberProfile.id} />
      </div>
    </FeatureLock>
  );
}
