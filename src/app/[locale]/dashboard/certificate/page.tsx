import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CertificateClient from "./CertificateClient";

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
      user: true,
    }
  });

  if (!memberProfile) {
    redirect("/dashboard/membership");
  }

  const certData = {
    name: memberProfile.user.name,
    memberId: memberProfile.memberId,
    membershipType: memberProfile.membershipType.replace("_", " "),
    issueDate: new Date(memberProfile.issueDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  };

  return <CertificateClient data={certData} />;
}
