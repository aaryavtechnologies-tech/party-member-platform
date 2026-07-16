import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { Organization as OrgSection } from "@/components/sections/Organization";
import { useTranslations } from "next-intl";

export default function OrganizationPage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("organizationPage");
  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("desc")}
        breadcrumbs={[
          { label: tNav("organization"), href: "/organization" }
        ]}
      />
      <div className="pt-10">
        <OrgSection />
      </div>
    </main>
  );
}
