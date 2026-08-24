import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

import { OrgHero } from "@/components/organization-structure/OrgHero";
import { OrgIntroduction } from "@/components/organization-structure/OrgIntroduction";
import { OrgVision } from "@/components/organization-structure/OrgVision";
import { OrgHierarchy } from "@/components/organization-structure/OrgHierarchy";
import { OrgSpecialWings } from "@/components/organization-structure/OrgSpecialWings";
import { OrgLeadershipJourney } from "@/components/organization-structure/OrgLeadershipJourney";
import { OrgWorkingPrinciples } from "@/components/organization-structure/OrgWorkingPrinciples";
import { OrgTechnology } from "@/components/organization-structure/OrgTechnology";
import { OrgCommitment } from "@/components/organization-structure/OrgCommitment";
import { OrgFinalMotto } from "@/components/organization-structure/OrgFinalMotto";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "OrganizationStructure",
  });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
  };
}

export default async function OrganizationStructurePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex min-h-screen flex-col">
      <OrgHero />
      <OrgIntroduction />
      <OrgVision />
      <OrgHierarchy />
      <OrgSpecialWings />
      <OrgLeadershipJourney />
      <OrgWorkingPrinciples />
      <OrgTechnology />
      <OrgCommitment />
      <OrgFinalMotto />
    </main>
  );
}
