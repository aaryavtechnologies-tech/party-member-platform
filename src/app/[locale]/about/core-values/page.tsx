import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { useTranslations } from "next-intl";

export default function CoreValuesPage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("coreValuesPageContent");

  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("subtitle")}
        breadcrumbs={[
          { label: tNav("about"), href: "/about" },
          { label: t("title"), href: "/about/core-values" }
        ]}
      />
      <div className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-primary">{t("title")}</h2>
            <p className="text-2xl italic text-accent font-medium">{t("slogan")}</p>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">{t("intro")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
            {t.raw("values").map((value: { title: string; desc: string }, idx: number) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-primary leading-tight group-hover:text-accent transition-colors">
                    {value.title.replace(/^\d+\.\s*/, '')}
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-auto">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-primary text-white rounded-3xl p-8 md:p-10 shadow-2xl flex flex-col justify-center text-center">
              <h3 className="text-3xl font-bold text-accent mb-6">{t("resolution_title")}</h3>
              <p className="text-lg opacity-90 mb-4">{t("resolution_p1")}</p>
              <p className="text-lg opacity-90 font-medium">{t("resolution_p2")}</p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center text-center">
              <h3 className="text-2xl font-bold text-primary mb-8">{t("slogan_title")}</h3>
              <div className="space-y-6 w-full">
                {t.raw("slogans").map((slogan: string, idx: number) => (
                  <p key={idx} className="text-xl font-bold text-accent py-4 border-t border-slate-100 dark:border-slate-800 last:border-b last:pb-4">{slogan}</p>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
