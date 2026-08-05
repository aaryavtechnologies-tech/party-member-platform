import { getVideoEntries } from "@/actions/admin/video-gallery";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Plus, Video as VideoIcon, Calendar } from "lucide-react";

// Helper to extract YouTube ID for iframe embedding
function getYouTubeID(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default async function AdminVideosPage() {
  const videos = await getVideoEntries();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <AdminBreadcrumbs />
        <Link href="/admin/media/videos/create">
          <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
            <Plus className="w-4 h-4" /> Add Video
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xl font-bold mb-6">Video Entries</h2>
        
        {videos.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <VideoIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No standalone videos found. Videos attached to News Articles will still appear in the public gallery automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((vid) => {
              const ytId = getYouTubeID(vid.videoUrl);
              const thumbnail = vid.thumbnailUrl || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null);

              return (
                <div key={vid.id} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden group">
                  <div className="aspect-video bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative">
                    {thumbnail ? (
                      <img 
                        src={thumbnail} 
                        alt={vid.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <VideoIcon className="w-8 h-8 text-slate-300" />
                    )}
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider block mb-1">{vid.category}</span>
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{vid.title}</h3>
                    <div className="text-sm text-slate-500 space-y-1">
                      {vid.eventDate && (
                        <p className="flex items-center gap-2"><Calendar className="w-3 h-3"/> {new Date(vid.eventDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
