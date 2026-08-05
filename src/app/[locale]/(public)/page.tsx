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

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "homepage" });

  return (
    <>
      <BreakingNewsBar locale={locale} />
      <Hero />
      <Stats />
      <About />
      <Resolutions />
      <Vision />
      <Mission />
      <CoreValues />
      <Policies />
      <Organization />
      <MembershipCTA />
      <Media />
      <FAQ />
    </>
  );
}
