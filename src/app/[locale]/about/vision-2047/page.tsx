import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { Vision } from "@/components/sections/Vision";
import { useTranslations } from "next-intl";

export default function Vision2047Page() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("aboutUs.vision_2047");
  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("desc")}
        breadcrumbs={[
          { label: tNav("about"), href: "/about" },
          { label: t("title"), href: "/about/vision-2047" }
        ]}
      />
      <div className="pt-20 pb-10 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 max-w-4xl text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-20">
          <p className="mb-6">
            {t("p1")}
          </p>
          <p>
            {t("p2")}
          </p>
        </div>
      </div>
      <Vision />
    </main>
  );
}
