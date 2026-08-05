import { getVideoEntries } from "@/actions/admin/gallery";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Search, Plus, Trash2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireAdminAuth } from "@/lib/rbac";
import { canApproveContent } from "@/lib/cms-rbac";

export const dynamic = 'force-dynamic';

export default async function VideoGalleryPage() {
  const session = await requireAdminAuth();
  const videos = await getVideoEntries();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <AdminBreadcrumbs />
        <Button className="bg-slate-900 text-white hover:bg-slate-800">
          <Plus className="w-4 h-4 mr-2" /> Add Video
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" /> Video Gallery
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {videos.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">
              No video entries found in your jurisdiction.
            </div>
          ) : (
            videos.map((video: any) => {
              const canDelete = session.role === "SUPER_ADMIN" || session.id === video.authorId || canApproveContent(session.role, video.creatorRole);
              return (
                <div key={video.id} className="group relative border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-md transition-all">
                  <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden">
                    {video.thumbnailUrl ? (
                      <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <Video className="w-8 h-8 text-slate-300" />
                    )}
                    
                    <div className="absolute top-2 right-2 flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        video.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 
                        video.status === 'PENDING_APPROVAL' ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {video.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate" title={video.title}>{video.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{video.description || "No description"}</p>
                    <p className="text-xs text-slate-400 mt-2 font-medium">
                      Scope: {video.state || "National"} {video.district ? `> ${video.district}` : ""}
                    </p>
                    
                    <div className="mt-4 flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-500 font-semibold truncate max-w-[150px]">{video.category}</span>
                      {canDelete && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
