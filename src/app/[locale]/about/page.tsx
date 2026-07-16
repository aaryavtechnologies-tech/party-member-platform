import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { About as AboutSection } from "@/components/sections/About";
import { Vision } from "@/components/sections/Vision";
import { Mission } from "@/components/sections/Mission";
import { CoreValues } from "@/components/sections/CoreValues";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("aboutUs");

  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("desc")}
        breadcrumbs={[{ label: t("title"), href: "/about" }]}
      />
      <div className="pt-20">
        <AboutSection />
      </div>
      <Vision />
      <Mission />
      <CoreValues />
    </main>
  );
}
