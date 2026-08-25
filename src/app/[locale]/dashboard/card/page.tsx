import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DigitalCardClient from "./DigitalCardClient";
import { FeatureLock } from "@/components/shared/FeatureLock";
import { isMembershipActiveOrInGracePeriod } from "@/lib/membership-check";
import { formatMemberId } from "@/lib/utils";

export default async function DigitalCardPage() {
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
      },
      officeBearers: {
        include: {
          unit: true
        }
      }
    }
  });

  if (!memberProfile) {
    // If not a registered member, redirect to membership
    redirect("/dashboard/membership");
  }

  // Check if member has paid or is within 30 days
  const hasSuccessfulPayment = memberProfile.user.payments.length > 0;
  const canAccess = isMembershipActiveOrInGracePeriod(memberProfile.createdAt, hasSuccessfulPayment);

  // Determine official assignment
  const assignment = memberProfile.officeBearers.find(a => a.status === "ACTIVE");
  const stateDistrict = assignment 
    ? `${assignment.unit.nameEn}` 
    : memberProfile.state 
      ? `${memberProfile.state || ''} / ${memberProfile.district || ''}`
      : "India";

  const cardData = {
    name: memberProfile.user.name,
    fatherName: memberProfile.fatherName || "",
    dob: memberProfile.dob ? new Date(memberProfile.dob).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }) : "",
    mobile: memberProfile.mobile || "",
    address: memberProfile.fullAddress ? `${memberProfile.fullAddress}, ${memberProfile.pincode}` : "",
    memberId: formatMemberId(memberProfile.memberId),
    photoUrl: memberProfile.user.image || memberProfile.profilePic || "",
    issueDate: new Date(memberProfile.issueDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }),
    location: stateDistrict,
    membershipType: memberProfile.membershipType.replace("_", " ") + " Member"
  };

  return (
    <DigitalCardClient data={cardData} />
  );
}
