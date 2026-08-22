import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { getPhotoAlbums, getVideoEntries } from "@/actions/admin/gallery";
import { requireAdminAuth } from "@/lib/rbac";
import { GalleryDashboardClient } from "./GalleryDashboardClient";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const session = await requireAdminAuth();
  const [albums, videos] = await Promise.all([
    getPhotoAlbums(),
    getVideoEntries(),
  ]);

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />
      <GalleryDashboardClient 
        albums={albums}
        videos={videos}
        userRole={session.role}
        userId={session.id}
      />
    </div>
  );
}
