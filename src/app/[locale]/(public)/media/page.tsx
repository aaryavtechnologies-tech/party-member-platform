import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { Media } from "@/components/sections/Media";
import { useTranslations } from "next-intl";

export default function MediaPage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("mediaPage");
  return (
    <main>
      <InnerPageHeader 
        title={t("title")} 
        description={t("desc")}
        breadcrumbs={[
          { label: tNav("media"), href: "/media" }
        ]}
      />
      <div className="pt-10">
        <Media />
      </div>
    </main>
  );
}
