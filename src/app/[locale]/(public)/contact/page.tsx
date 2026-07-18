import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("contactPage");
  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("desc")}
        breadcrumbs={[
          { label: tNav("contact"), href: "/contact" }
        ]}
      />
      <div className="py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">{t("heading")}</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">
            {t("info")}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-900/5">
              <h3 className="font-bold text-lg mb-2">{t("hq.title")}</h3>
              <p className="text-slate-600 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: t.raw("hq.address") }}></p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-900/5">
              <h3 className="font-bold text-lg mb-2">{t("helpline.title")}</h3>
              <p className="text-slate-600 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: t.raw("helpline.number") }}></p>
            </div>
            <div className="p-8 bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-900/5">
              <h3 className="font-bold text-lg mb-2">{t("media.title")}</h3>
              <p className="text-slate-600 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: t.raw("media.emails") }}></p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
