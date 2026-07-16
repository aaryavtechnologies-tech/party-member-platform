import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { useTranslations } from "next-intl";

export default function ObjectivesPage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("aboutUs.objectives");
  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("desc")}
        breadcrumbs={[
          { label: tNav("about"), href: "/about" },
          { label: t("title"), href: "/about/objectives" }
        ]}
      />
      <div className="py-32 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="grid md:grid-cols-2 gap-8 text-left">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="text-primary font-bold text-xl mb-2">{t("objective", { num: i + 1 })}</div>
                <p className="text-slate-700 dark:text-slate-300 text-lg">{t(`list.${i}` as any)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
