import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { useTranslations } from "next-intl";
import { CheckCircle2, GraduationCap } from "lucide-react";

export default function EducationPolicyPage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("educationPolicyPageContent");

  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("subtitle")}
        breadcrumbs={[
          { label: tNav("policies"), href: "/policies" },
          { label: t("title"), href: "/policies/education" }
        ]}
      />
      
      <div className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Intro Section */}
          <div className="text-center max-w-4xl mx-auto mb-20 space-y-8">
            <h2 className="text-4xl font-bold text-primary">{t("intro_title")}</h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
            <p className="text-2xl italic text-accent font-medium pb-6">{t("slogan")}</p>
            
            <div className="space-y-6 text-xl text-slate-700 dark:text-slate-300 leading-relaxed text-left bg-white dark:bg-slate-950 p-8 md:p-12 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <p>{t("intro_p1")}</p>
              {t.has("intro_p2") && <p>{t("intro_p2")}</p>}
            </div>
          </div>

          {/* Vision Section */}
          <div className="mb-24 flex justify-center">
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-12 rounded-3xl shadow-xl max-w-4xl w-full">
              <h3 className="text-3xl font-bold text-primary mb-6 text-center">{t("vision_title")}</h3>
              {t.has("vision_p1") && t("vision_p1") && <p className="text-xl text-slate-600 dark:text-slate-400 mb-6 text-center">{t("vision_p1")}</p>}
              <div className="grid sm:grid-cols-2 gap-4">
                {t.raw("visions").map((vision: string, idx: number) => (
                  <div key={idx} className="flex items-center space-x-3 text-lg font-medium p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <GraduationCap className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{vision}</span>
                  </div>
                ))}
              </div>
             </div>
          </div>

          {/* Goals Section - Conditional */}
          {t.has("goals") && t.raw("goals").length > 0 && (
            <div className="mb-24 flex justify-center">
              <div className="bg-primary text-white p-8 md:p-12 rounded-3xl shadow-xl max-w-4xl w-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <h3 className="text-3xl font-bold text-accent mb-8 relative z-10 flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8" />
                  {t("goals_title")}
                </h3>
                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                  {t.raw("goals").map((goal: string, idx: number) => (
                    <div key={idx} className="flex items-start space-x-3 text-lg font-medium">
                      <span className="text-accent mt-1">✦</span>
                      <span>{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Points Section (If goals were empty, we show goals_title here) */}
          {t.has("points") && t.raw("points").length > 0 && (
            <>
              {(!t.has("goals") || t.raw("goals").length === 0) && (
                 <h3 className="text-3xl font-bold text-primary mb-12 text-center flex items-center justify-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-accent" />
                    {t("goals_title")}
                 </h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24">
                {t.raw("points").map((point: { title: string; desc: string }, idx: number) => (
                  <div 
                    key={idx}
                    className="bg-white dark:bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 group flex flex-col h-full"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                        {idx + 1}
                      </div>
                      <h3 className="text-xl font-bold text-primary leading-tight group-hover:text-accent transition-colors">
                        {point.title.replace(/^\d+\.\s*/, '')}
                      </h3>
                    </div>
                    {point.desc && (
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-auto">
                        {point.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Resolution & Slogans combined */}
          <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto mb-20">
            <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-primary mb-6">{t("resolution_title").replace(/^\d+\.\s*/, '')}</h2>
              <div className="space-y-4 text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                <p>{t("resolution_p1")}</p>
                {t.has("resolution_p2") && <p>{t("resolution_p2")}</p>}
              </div>
            </div>
            
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 md:p-10 border border-slate-200 dark:border-slate-700 flex flex-col justify-center text-center shadow-xl">
              <h3 className="text-lg font-bold text-slate-500 mb-6 tracking-widest uppercase">{t("slogan_title")}</h3>
              <div className="flex flex-col space-y-6 text-2xl font-bold text-primary">
                {t.raw("slogans").map((slogan: string, idx: number) => (
                  <span key={idx} className="text-accent">{slogan}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
