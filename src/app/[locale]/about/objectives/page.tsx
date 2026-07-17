import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";

export default function ObjectivesPage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("objectivesPageContent");

  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("subtitle")}
        breadcrumbs={[
          { label: tNav("about"), href: "/about" },
          { label: t("title"), href: "/about/objectives" }
        ]}
      />
      <div className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-primary">{t("title")}</h2>
            <p className="text-2xl italic text-accent font-medium">{t("slogan")}</p>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">{t("intro")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {t.raw("sections").map((section: { category: string; points: string[] }, idx: number) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-primary mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  {section.category}
                </h3>
                <ul className="space-y-4">
                  {section.points.map((point: string, i: number) => (
                    <li key={i} className="flex items-start space-x-3 text-slate-600 dark:text-slate-400">
                      <ChevronRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{point.replace(/^\d+\.\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-primary text-white rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-accent mb-6">{t("resolution_title")}</h3>
              <div className="space-y-4 text-xl opacity-90 mb-10 max-w-3xl mx-auto">
                <p>{t("resolution_p1")}</p>
                <p>{t("resolution_p2")}</p>
              </div>
              
              <div className="pt-8 border-t border-white/20">
                <p className="text-sm font-medium opacity-70 mb-4 tracking-widest uppercase">{t("slogan_title")}</p>
                <div className="flex flex-col md:flex-row justify-center items-center md:space-x-8 space-y-4 md:space-y-0 text-xl font-bold">
                  {t.raw("slogans").map((slogan: string, idx: number) => (
                    <p key={idx}>{slogan}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
