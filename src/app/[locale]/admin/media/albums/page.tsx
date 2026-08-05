import { getAlbums } from "@/actions/admin/gallery";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Plus, Image as ImageIcon, Calendar, MapPin } from "lucide-react";

export default async function AdminAlbumsPage() {
  const albums = await getAlbums();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <AdminBreadcrumbs />
        <Link href="/admin/media/albums/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus className="w-4 h-4" /> Create Album
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xl font-bold mb-6">Photo Albums</h2>
        
        {albums.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No albums found. Photos attached to News Articles will still appear in the public gallery automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div key={album.id} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden group">
                <div className="aspect-video bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative">
                  {album.media.length > 0 ? (
                    <img 
                      src={album.media[0].media.url} 
                      alt={album.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  )}
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded">
                    {album.media.length} Photos
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">{album.category}</span>
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{album.title}</h3>
                  <div className="text-sm text-slate-500 space-y-1">
                    {album.eventDate && (
                      <p className="flex items-center gap-2"><Calendar className="w-3 h-3"/> {new Date(album.eventDate).toLocaleDateString()}</p>
                    )}
                    {album.location && (
                      <p className="flex items-center gap-2"><MapPin className="w-3 h-3"/> {album.location}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
