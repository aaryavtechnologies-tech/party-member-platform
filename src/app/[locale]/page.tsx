import { useTranslations } from "next-intl";
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

export default function Home() {
  const t = useTranslations("Index");

  return (
    <>
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
