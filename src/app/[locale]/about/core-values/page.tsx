import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { CoreValues as CoreValuesSection } from "@/components/sections/CoreValues";
import { useTranslations } from "next-intl";

export default function CoreValuesPage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("aboutUs.core_values");
  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("desc")}
        breadcrumbs={[
          { label: tNav("about"), href: "/about" },
          { label: t("title"), href: "/about/core-values" }
        ]}
      />
      <div className="pt-20">
        <CoreValuesSection />
      </div>
    </main>
  );
}
