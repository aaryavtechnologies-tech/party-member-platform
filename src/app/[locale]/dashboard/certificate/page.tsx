import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CertificateClient from "./CertificateClient";
import { FeatureLock } from "@/components/shared/FeatureLock";
import { isMembershipActiveOrInGracePeriod } from "@/lib/membership-check";
import { formatMemberId } from "@/lib/utils";

export default async function CertificatePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) {
    redirect("/membership/login");
  }

  // Fetch Member Profile
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

  // Check if member has paid or is within 30 days
  const hasSuccessfulPayment = memberProfile.user.payments.length > 0;
  const canAccess = isMembershipActiveOrInGracePeriod(memberProfile.createdAt, hasSuccessfulPayment);

  const certData = {
    name: memberProfile.user.name,
    memberId: formatMemberId(memberProfile.memberId),
    membershipType: memberProfile.membershipType.replace("_", " "),
    issueDate: new Date(memberProfile.issueDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  };

  return (
    <FeatureLock isPaidOrInGracePeriod={canAccess}>
      <CertificateClient data={certData} />
    </FeatureLock>
  );
}
