import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MembershipUpgradeClient } from "./MembershipUpgradeClient";

export default async function MembershipUpgradePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) {
    redirect("/membership/login");
  }

  const memberProfile = await prisma.memberProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!memberProfile) {
    redirect("/dashboard");
  }

  return <MembershipUpgradeClient currentTier={memberProfile.membershipType} />;
}
