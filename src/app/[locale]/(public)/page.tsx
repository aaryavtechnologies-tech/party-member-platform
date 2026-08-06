import { getTranslations } from "next-intl/server";
import { BreakingNewsBar } from "@/components/news/BreakingNewsBar";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { About } from "@/components/sections/About";
import { Resolutions } from "@/components/sections/Resolutions";
import { Vision } from "@/components/sections/Vision";
import { Mission } from "@/components/sections/Mission";
import { CoreValues } from "@/components/sections/CoreValues";
import { Policies } from "@/components/sections/Policies";
import { Organization } from "@/components/sections/Organization";
import { MembershipCTA } from "@/components/sections/MembershipCTA";
import { Media } from "@/components/sections/Media";
import { FAQ } from "@/components/sections/FAQ";
import { getPublicStats, getPublicCoreValues, getPublicPolicies, getPublicFAQs } from "@/actions/public/cms";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "homepage" });
  
  const [statsData, coreValuesData, policiesData, faqsData] = await Promise.all([
    getPublicStats(),
    getPublicCoreValues(),
    getPublicPolicies(locale),
    getPublicFAQs(locale)
  ]);

  return (
    <>
      <BreakingNewsBar locale={locale} />
      <Hero />
      <Stats data={statsData} />
      <About />
      <Resolutions />
      <Vision />
      <Mission />
      <CoreValues data={coreValuesData} />
      <Policies data={policiesData} />
      <Organization />
      <MembershipCTA />
      <Media />
      <FAQ data={faqsData} />
    </>
  );
}
