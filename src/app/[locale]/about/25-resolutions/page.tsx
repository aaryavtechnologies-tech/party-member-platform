import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { Resolutions } from "@/components/sections/Resolutions";
import { useTranslations } from "next-intl";

export default function ResolutionsPage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("aboutUs.resolutions");
  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("desc")}
        breadcrumbs={[
          { label: tNav("about"), href: "/about" },
          { label: t("title"), href: "/about/25-resolutions" }
        ]}
      />
      <div className="pt-20">
        <Resolutions />
      </div>
    </main>
  );
}
