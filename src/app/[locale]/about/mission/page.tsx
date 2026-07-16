import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { Mission as MissionSection } from "@/components/sections/Mission";
import { useTranslations } from "next-intl";

export default function MissionPage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("aboutUs.mission");
  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("desc")}
        breadcrumbs={[
          { label: tNav("about"), href: "/about" },
          { label: t("title"), href: "/about/mission" }
        ]}
      />
      <MissionSection />
      
      <div className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">{t("action_plan")}</h2>
          <div className="space-y-8 text-lg text-slate-600 dark:text-slate-400">
            <p>
              {t("p1")}
            </p>
            <ul className="list-disc pl-6 space-y-4 text-slate-700 dark:text-slate-300">
              <li><strong>{t("li1_strong")}</strong>{t("li1")}</li>
              <li><strong>{t("li2_strong")}</strong>{t("li2")}</li>
              <li><strong>{t("li3_strong")}</strong>{t("li3")}</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
