import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";

export default function Vision2047Page() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("vision2047PageContent");

  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("subtitle")}
        breadcrumbs={[
          { label: tNav("about"), href: "/about" },
          { label: t("title"), href: "/about/vision-2047" }
        ]}
      />
      <div className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-primary">{t("title")}</h2>
            <p className="text-2xl italic text-accent font-medium">{t("slogan")}</p>
            <div className="text-lg text-slate-700 dark:text-slate-300 space-y-4">
              <p>{t("intro_p1")}</p>
              <p>{t("intro_p2")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
            {t.raw("sections").map((section: { title: string; desc: string; points: string[] }, idx: number) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-primary leading-tight">
                    {section.title.replace(/^\d+\.\s*/, '')}
                  </h3>
                </div>
                {section.desc && (
                  <p className="text-slate-600 dark:text-slate-400 mb-4 font-medium">
                    {section.desc}
                  </p>
                )}
                <ul className="space-y-3 mt-auto">
                  {section.points.map((point: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2 text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="bg-primary text-white rounded-3xl p-8 md:p-12 shadow-2xl">
              <h3 className="text-3xl font-bold text-accent mb-6">{t("dream_title")}</h3>
              <p className="text-xl opacity-90 mb-6">{t("dream_desc")}</p>
              <ul className="space-y-4 text-lg">
                {t.raw("dreams").map((dream: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="text-accent mt-1">✦</span>
                    <span>{dream}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-primary mb-6">{t("message_title")}</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                {t("message_desc")}
              </p>
              <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                <p className="text-2xl font-bold text-accent">{t("final_slogan")}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
