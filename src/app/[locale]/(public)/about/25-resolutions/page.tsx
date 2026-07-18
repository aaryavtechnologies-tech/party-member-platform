import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { useTranslations } from "next-intl";

export default function ResolutionsPage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("resolutionsPageContent");

  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("subtitle")}
        breadcrumbs={[
          { label: tNav("about"), href: "/about" },
          { label: t("title"), href: "/about/25-resolutions" }
        ]}
      />
      <div className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-primary">{t("title")}</h2>
            <p className="text-2xl italic text-accent font-medium">{t("slogan")}</p>
            <p className="text-lg text-slate-700 dark:text-slate-300">{t("intro")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
            {t.raw("items").map((item: { title: string; desc: string }, idx: number) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 group flex flex-col"
              >
                <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex-grow">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-primary text-white rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-2xl">
            <h3 className="text-3xl font-bold text-accent mb-4">{t("outro_title")}</h3>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">{t("outro_desc")}</p>
            <div className="flex flex-col space-y-4 pt-8 border-t border-white/20">
              {t.raw("slogans").map((slogan: string, idx: number) => (
                <p key={idx} className="text-2xl font-bold">{slogan}</p>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
