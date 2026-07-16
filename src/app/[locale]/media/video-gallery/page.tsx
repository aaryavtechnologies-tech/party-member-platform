import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { useTranslations } from "next-intl";

export default function VideoGalleryPage() {
  const tNav = useTranslations("Navigation");
  const t = useTranslations("mediaPage");

  return (
    <main>
      <InnerPageHeader 
        title={t("subpages.video.title")} 
        description={t("subpages.video.desc")}
        breadcrumbs={[
          { label: tNav("media"), href: "/media" },
          { label: t("subpages.video.title"), href: "/media/video-gallery" }
        ]}
      />
      <div className="py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl text-slate-500">{t("subpages.video.content")}</p>
        </div>
      </div>
    </main>
  );
}
