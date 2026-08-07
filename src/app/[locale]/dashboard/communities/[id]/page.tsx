import { getCommunityDetails, getCommunityPosts } from "@/actions/communities/fetch";
import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import CommunityFeedClient from "./CommunityFeedClient";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { FeatureLock } from "@/components/shared/FeatureLock";
import { isMembershipActiveOrInGracePeriod } from "@/lib/membership-check";

export default async function CommunityDetailPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) redirect("/membership/login");

  const memberProfile = await prisma.memberProfile.findUnique({
    where: { userId: session.user.id },
    include: { user: { include: { payments: { where: { status: "SUCCESS" } } } } }
  });

  if (!memberProfile) redirect("/dashboard/membership");

  const hasSuccessfulPayment = memberProfile.user.payments.length > 0;
  const canAccess = isMembershipActiveOrInGracePeriod(
    memberProfile.createdAt, 
    hasSuccessfulPayment, 
    memberProfile.membershipType, 
    "LIFETIME_ACTIVE"
  );

  const community = await getCommunityDetails(id);
  if (!community) redirect("/dashboard/communities");

  // Check access
  if (!community.isPublic) {
    const isMember = await prisma.communityMember.findUnique({
      where: { communityId_memberProfileId: { communityId: id, memberProfileId: memberProfile.id } }
    });
    if (!isMember) {
      redirect("/dashboard/communities");
    }
  }

  const posts = canAccess ? await getCommunityPosts(id) : [];

  return (
    <FeatureLock isPaidOrInGracePeriod={canAccess} requiredTier="LIFETIME_ACTIVE">
      <main>
        <InnerPageHeader 
          title={community.name} 
          breadcrumbs={[
            { label: "Communities", href: "/dashboard/communities" },
            { label: community.name, href: `/dashboard/communities/${id}` }
          ]}
        />
        
        <div className="p-6 max-w-4xl mx-auto">
          <CommunityFeedClient 
            community={community} 
            initialPosts={posts} 
            memberProfileId={memberProfile.id}
            authorType="MEMBER"
          />
        </div>
      </main>
    </FeatureLock>
  );
}
