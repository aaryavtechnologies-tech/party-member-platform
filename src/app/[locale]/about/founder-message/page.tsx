import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { useTranslations } from "next-intl";

export default function FounderMessagePage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("aboutUs.founder_message");
  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("desc")}
        breadcrumbs={[
          { label: tNav("about"), href: "/about" },
          { label: t("title"), href: "/about/founder-message" }
        ]}
      />
      <div className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-4xl flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/3 aspect-[3/4] bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Placeholder for Founder Image */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold">Image</div>
          </div>
          <div className="w-full md:w-2/3 space-y-6 text-lg text-slate-700 dark:text-slate-300">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t("heading")}</h2>
            <p>
              {t("p1")}
            </p>
            <p>
              {t("p2")}
            </p>
            <p className="font-bold text-slate-900 dark:text-white pt-4">
              {t("signature")}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
