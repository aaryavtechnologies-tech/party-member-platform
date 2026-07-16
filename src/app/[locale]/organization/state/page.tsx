import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { useTranslations } from "next-intl";

export default function StateTeamPage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("organizationPage");

  return (
    <main>
      <InnerPageHeader 
        title={t("subpages.state")} 
        breadcrumbs={[
          { label: tNav("organization"), href: "/organization" },
          { label: t("subpages.state"), href: "/organization/state" }
        ]}
      />
      <div className="py-24 bg-white dark:bg-slate-950 min-h-[50vh] flex items-center justify-center">
        <div className="text-center text-slate-500 dark:text-slate-400">
          <p className="text-xl">{t("subpages.content")}</p>
        </div>
      </div>
    </main>
  );
}
