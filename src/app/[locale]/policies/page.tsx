import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { Policies } from "@/components/sections/Policies";
import { useTranslations } from "next-intl";

export default function PoliciesPage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("policiesPage");
  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("desc")}
        breadcrumbs={[
          { label: tNav("policies"), href: "/policies" }
        ]}
      />
      <div className="pt-10">
        <Policies />
      </div>
    </main>
  );
}
