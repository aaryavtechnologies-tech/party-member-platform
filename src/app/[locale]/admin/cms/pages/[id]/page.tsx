import { getCmsPageById } from "@/actions/admin/cms";
import CMSPageEditorClient from "./CMSPageEditorClient";

export default async function CMSPageEditor({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const resolvedParams = await params;
  const isNew = resolvedParams.id === "new";
  let initialData = null;

  if (!isNew) {
    const res = await getCmsPageById(resolvedParams.id);
    if (res.success && res.page) {
      initialData = res.page;
    }
  }

  return <CMSPageEditorClient initialData={initialData} locale={resolvedParams.locale} />;
}
