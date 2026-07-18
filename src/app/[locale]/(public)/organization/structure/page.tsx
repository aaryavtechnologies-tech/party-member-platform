import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { Organization } from "@/components/sections/Organization";
import { useTranslations } from "next-intl";

export default function OrganizationStructurePage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("organizationPage.structure");
  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("desc")}
        breadcrumbs={[
          { label: tNav("organization"), href: "/organization" },
          { label: t("title"), href: "/organization/structure" }
        ]}
      />
      <div className="pt-10">
        <Organization />
      </div>
    </main>
  );
}
