import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { useTranslations } from "next-intl";

export default function NewsPage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("mediaPage");
  return (
    <main>
      <InnerPageHeader 
        title={t("subpages.news.title")} 
        description={t("subpages.news.desc")}
        breadcrumbs={[
          { label: tNav("media"), href: "/media" },
          { label: t("subpages.news.title"), href: "/media/news" }
        ]}
      />
      <div className="py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl text-slate-500">{t("subpages.news.content")}</p>
        </div>
      </div>
    </main>
  );
}
