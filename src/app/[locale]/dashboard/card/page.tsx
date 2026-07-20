import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DigitalCardClient from "./DigitalCardClient";

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
      user: true,
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

  // Determine official assignment
  const assignment = memberProfile.officeBearers.find(a => a.status === "ACTIVE");
  const stateDistrict = assignment 
    ? `${assignment.unit.nameEn}` 
    : memberProfile.state 
      ? `${memberProfile.state || ''} / ${memberProfile.district || ''}`
      : "India";

  const cardData = {
    name: memberProfile.user.name,
    memberId: memberProfile.memberId,
    photoUrl: memberProfile.user.image,
    issueDate: new Date(memberProfile.issueDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }),
    location: stateDistrict,
    membershipType: memberProfile.membershipType.replace("_", " ") + " Member"
  };

  return <DigitalCardClient data={cardData} />;
}
