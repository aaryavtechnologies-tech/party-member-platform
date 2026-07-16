import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { useTranslations } from "next-intl";

export default function JourneyPage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("aboutUs.journey");
  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("desc")}
        breadcrumbs={[
          { label: tNav("about"), href: "/about" },
          { label: t("title"), href: "/about/journey" }
        ]}
      />
      <div className="py-32 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-4xl text-center text-slate-600 dark:text-slate-400">
          <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">{t("history")}</h2>
          <p className="text-xl mb-12">{t("history_desc")}</p>
          
          <div className="bg-slate-50 dark:bg-slate-900 p-12 rounded-3xl border border-slate-100 dark:border-slate-800">
            <p className="italic">{t("history_placeholder")}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
