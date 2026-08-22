"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Plus, Search, Image as ImageIcon, Video, Trash2, CheckCircle, 
  Upload, X, Loader2, Calendar, Folder, ExternalLink, PlayCircle 
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { 
  createPhotoAlbumWithImages, 
  createVideoEntry, 
  deletePhotoAlbum, 
  deleteVideoEntry,
  approvePhotoAlbum,
  approveVideoEntry
} from "@/actions/admin/gallery";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";

interface GalleryDashboardClientProps {
  albums: any[];
  videos: any[];
  userRole: string;
  userId: string;
}

export function GalleryDashboardClient({
  albums: initialAlbums,
  videos: initialVideos,
  userRole,
  userId,
}: GalleryDashboardClientProps) {
  const router = useRouter();
  const [albums, setAlbums] = useState(initialAlbums);
  const [videos, setVideos] = useState(initialVideos);
  const [activeTab, setActiveTab] = useState<"all" | "photos" | "videos">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Photo Album Form State
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [albumCategory, setAlbumCategory] = useState("General");
  const [albumEventDate, setAlbumEventDate] = useState("");
  const [albumImages, setAlbumImages] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isSubmittingAlbum, setIsSubmittingAlbum] = useState(false);

  // Video Entry Form State
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoCategory, setVideoCategory] = useState("General");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoEventDate, setVideoEventDate] = useState("");
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [isSubmittingVideo, setIsSubmittingVideo] = useState(false);

  // Statistics
  const totalAlbums = albums.length;
  const totalPhotos = albums.reduce((acc, a) => acc + (a.media?.length || 0), 0);
  const totalVideos = videos.length;
  const publishedItems = albums.filter(a => a.status === "PUBLISHED").length + videos.filter(v => v.status === "PUBLISHED").length;

  // Multi-image upload for albums
  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImages(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Upload failed for ${files[i].name}`);
        }
        const data = await res.json();
        uploadedUrls.push(data.url);
      }
      setAlbumImages(prev => [...prev, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to upload images");
    } finally {
      setIsUploadingImages(false);
      e.target.value = "";
    }
  };

  // Thumbnail upload for video
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingThumb(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Thumbnail upload failed");
      const data = await res.json();
      setThumbnailUrl(data.url);
      toast.success("Thumbnail uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload thumbnail");
    } finally {
      setIsUploadingThumb(false);
      e.target.value = "";
    }
  };

  // Create Album Submission
  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumTitle.trim()) {
      toast.error("Please provide an album title");
      return;
    }

    setIsSubmittingAlbum(true);
    try {
      const newAlbum = await createPhotoAlbumWithImages({
        title: albumTitle.trim(),
        description: albumDescription.trim() || undefined,
        category: albumCategory,
        eventDate: albumEventDate || undefined,
        imageUrls: albumImages,
        status: "PUBLISHED",
      });

      setAlbums(prev => [newAlbum, ...prev]);
      toast.success("Photo album created successfully!");
      setIsPhotoModalOpen(false);
      
      // Reset form
      setAlbumTitle("");
      setAlbumDescription("");
      setAlbumCategory("General");
      setAlbumEventDate("");
      setAlbumImages([]);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to create photo album");
    } finally {
      setIsSubmittingAlbum(false);
    }
  };

  // Create Video Submission
  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) {
      toast.error("Title and Video URL are required");
      return;
    }

    setIsSubmittingVideo(true);
    try {
      const newVideo = await createVideoEntry({
        title: videoTitle.trim(),
        description: videoDescription.trim() || undefined,
        category: videoCategory,
        videoUrl: videoUrl.trim(),
        thumbnailUrl: thumbnailUrl.trim() || undefined,
        eventDate: videoEventDate || undefined,
      }, "PUBLISHED");

      setVideos(prev => [newVideo, ...prev]);
      toast.success("Video entry added successfully!");
      setIsVideoModalOpen(false);

      // Reset form
      setVideoTitle("");
      setVideoDescription("");
      setVideoCategory("General");
      setVideoUrl("");
      setThumbnailUrl("");
      setVideoEventDate("");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to create video entry");
    } finally {
      setIsSubmittingVideo(false);
    }
  };

  // Delete handlers
  const handleDeleteAlbum = async (albumId: string) => {
    if (!confirm("Are you sure you want to delete this album?")) return;
    try {
      await deletePhotoAlbum(albumId);
      setAlbums(prev => prev.filter(a => a.id !== albumId));
      toast.success("Photo album deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete album");
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      await deleteVideoEntry(videoId);
      setVideos(prev => prev.filter(v => v.id !== videoId));
      toast.success("Video entry deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete video");
    }
  };

  // Approve handlers
  const handleApproveAlbum = async (albumId: string) => {
    try {
      await approvePhotoAlbum(albumId);
      setAlbums(prev => prev.map(a => a.id === albumId ? { ...a, status: "PUBLISHED" } : a));
      toast.success("Album approved & published!");
    } catch (err: any) {
      toast.error(err.message || "Failed to approve album");
    }
  };

  const handleApproveVideo = async (videoId: string) => {
    try {
      await approveVideoEntry(videoId);
      setVideos(prev => prev.map(v => v.id === videoId ? { ...v, status: "PUBLISHED" } : v));
      toast.success("Video approved & published!");
    } catch (err: any) {
      toast.error(err.message || "Failed to approve video");
    }
  };

  // Filtered lists
  const filteredAlbums = albums.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (a.category && a.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (v.category && v.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Media Gallery Management</h1>
          <p className="text-sm text-slate-500">Organize and publish high-res photos and video conferences.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsPhotoModalOpen(true)}
            className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" /> New Photo Album
          </Button>
          <Button 
            onClick={() => setIsVideoModalOpen(true)}
            className="bg-primary text-slate-950 hover:bg-primary/90 rounded-xl font-bold"
          >
            <Video className="w-4 h-4 mr-2" /> Add Video
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatsCard title="Photo Albums" value={totalAlbums} icon={Folder} />
        <AdminStatsCard title="Total Photos" value={totalPhotos} icon={ImageIcon} />
        <AdminStatsCard title="Video Entries" value={totalVideos} icon={Video} />
        <AdminStatsCard title="Published Items" value={publishedItems} icon={CheckCircle} />
      </div>

      {/* Gallery Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Controls Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === "all" ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              All Media ({albums.length + videos.length})
            </button>
            <button
              onClick={() => setActiveTab("photos")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${activeTab === "photos" ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <ImageIcon className="w-4 h-4" /> Albums ({albums.length})
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${activeTab === "videos" ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <Video className="w-4 h-4" /> Videos ({videos.length})
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search albums or videos..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* PHOTO ALBUMS LIST */}
          {(activeTab === "all" || activeTab === "photos") && (
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <ImageIcon className="w-5 h-5 text-primary" /> Photo Albums ({filteredAlbums.length})
                </h2>
              </div>

              {filteredAlbums.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">No photo albums found.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 rounded-xl"
                    onClick={() => setIsPhotoModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Create Album
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAlbums.map((album) => {
                    const coverUrl = album.media && album.media.length > 0 ? album.media[0].media?.url : null;
                    const canDelete = userRole === "SUPER_ADMIN" || album.authorId === userId;
                    const isPending = album.status === "PENDING_APPROVAL";

                    return (
                      <div key={album.id} className="group relative border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 shadow-sm hover:shadow-md transition-all flex flex-col">
                        <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden">
                          {coverUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={coverUrl} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <ImageIcon className="w-12 h-12 text-slate-300" />
                          )}
                          
                          <div className="absolute top-2 right-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                              album.status === 'PUBLISHED' ? 'bg-green-500 text-white' : 
                              album.status === 'PENDING_APPROVAL' ? 'bg-amber-500 text-white' :
                              'bg-slate-700 text-white'
                            }`}>
                              {album.status.replace("_", " ")}
                            </span>
                          </div>

                          <div className="absolute bottom-2 left-2 bg-slate-950/70 backdrop-blur-md text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1 font-medium">
                            <ImageIcon className="w-3.5 h-3.5" /> {album.media?.length || 0} Photos
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                              {album.category || "General"}
                            </span>
                            <h3 className="font-bold text-slate-900 dark:text-white mt-1.5 text-base line-clamp-1" title={album.title}>
                              {album.title}
                            </h3>
                            {album.description && (
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{album.description}</p>
                            )}
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <span className="text-[11px] text-slate-400">
                              {album.eventDate ? new Date(album.eventDate).toLocaleDateString() : "No date"}
                            </span>

                            <div className="flex items-center gap-1">
                              {isPending && userRole === "SUPER_ADMIN" && (
                                <button
                                  onClick={() => handleApproveAlbum(album.id)}
                                  title="Approve Album"
                                  className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/50 rounded-lg transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  onClick={() => handleDeleteAlbum(album.id)}
                                  title="Delete Album"
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIDEOS LIST */}
          {(activeTab === "all" || activeTab === "videos") && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Video className="w-5 h-5 text-primary" /> Video Gallery ({filteredVideos.length})
                </h2>
              </div>

              {filteredVideos.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <Video className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">No video entries found.</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 rounded-xl"
                    onClick={() => setIsVideoModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Video
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredVideos.map((video) => {
                    const canDelete = userRole === "SUPER_ADMIN" || video.authorId === userId;
                    const isPending = video.status === "PENDING_APPROVAL";

                    return (
                      <div key={video.id} className="group relative border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 shadow-sm hover:shadow-md transition-all flex flex-col">
                        <div className="aspect-video bg-slate-900 flex items-center justify-center relative overflow-hidden">
                          {video.thumbnailUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90" />
                          ) : (
                            <Video className="w-12 h-12 text-slate-600" />
                          )}

                          <a 
                            href={video.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="absolute inset-0 flex items-center justify-center bg-slate-950/40 hover:bg-slate-950/20 transition-colors"
                          >
                            <PlayCircle className="w-12 h-12 text-white/90 drop-shadow-md hover:scale-110 transition-transform" />
                          </a>
                          
                          <div className="absolute top-2 right-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                              video.status === 'PUBLISHED' ? 'bg-green-500 text-white' : 
                              video.status === 'PENDING_APPROVAL' ? 'bg-amber-500 text-white' :
                              'bg-slate-700 text-white'
                            }`}>
                              {video.status.replace("_", " ")}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                              {video.category || "General"}
                            </span>
                            <h3 className="font-bold text-slate-900 dark:text-white mt-1.5 text-base line-clamp-1" title={video.title}>
                              {video.title}
                            </h3>
                            {video.description && (
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{video.description}</p>
                            )}
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <a 
                              href={video.videoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                            >
                              Watch <ExternalLink className="w-3 h-3" />
                            </a>

                            <div className="flex items-center gap-1">
                              {isPending && userRole === "SUPER_ADMIN" && (
                                <button
                                  onClick={() => handleApproveVideo(video.id)}
                                  title="Approve Video"
                                  className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/50 rounded-lg transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  onClick={() => handleDeleteVideo(video.id)}
                                  title="Delete Video"
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CREATE PHOTO ALBUM MODAL */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" /> Create New Photo Album
              </h2>
              <button 
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Album Title <span className="text-red-500">*</span></label>
                <input 
                  type="text"
                  required
                  value={albumTitle}
                  onChange={e => setAlbumTitle(e.target.value)}
                  placeholder="e.g. Annual Party Convention 2026"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={albumCategory}
                    onChange={e => setAlbumCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="General">General</option>
                    <option value="Rallies">Rallies & Public Meetings</option>
                    <option value="Youth Wing">Youth Wing</option>
                    <option value="Women Wing">Women Wing</option>
                    <option value="Press Conferences">Press Conferences</option>
                    <option value="Social Initiatives">Social Initiatives</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Event Date</label>
                  <input 
                    type="date"
                    value={albumEventDate}
                    onChange={e => setAlbumEventDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                <textarea 
                  rows={3}
                  value={albumDescription}
                  onChange={e => setAlbumDescription(e.target.value)}
                  placeholder="Brief context and details about this album..."
                  className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Upload Photos Section */}
              <div className="space-y-3 pt-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex justify-between items-center">
                  <span>Upload Photos ({albumImages.length})</span>
                  {albumImages.length > 0 && (
                    <button 
                      type="button" 
                      onClick={() => setAlbumImages([])}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </label>

                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center bg-slate-50 dark:bg-slate-900/50">
                  <input 
                    type="file" 
                    id="album-file-upload" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    disabled={isUploadingImages}
                    onChange={handleMultipleImageUpload}
                  />
                  <label htmlFor="album-file-upload" className="cursor-pointer inline-flex flex-col items-center">
                    {isUploadingImages ? (
                      <Loader2 className="w-10 h-10 text-primary animate-spin mb-2" />
                    ) : (
                      <Upload className="w-10 h-10 text-slate-400 mb-2" />
                    )}
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                      {isUploadingImages ? "Uploading Photos..." : "Click to select multiple photos"}
                    </span>
                    <span className="text-xs text-slate-400 mt-1">JPEG, PNG, WebP up to 5MB each</span>
                  </label>
                </div>

                {albumImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 max-h-40 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                    {albumImages.map((img, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setAlbumImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsPhotoModalOpen(false)}
                  disabled={isSubmittingAlbum}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary text-slate-950 hover:bg-primary/90 font-bold rounded-xl"
                  disabled={isSubmittingAlbum || isUploadingImages || !albumTitle.trim()}
                >
                  {isSubmittingAlbum ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating Album...
                    </>
                  ) : (
                    "Publish Album"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD VIDEO MODAL */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" /> Add Video Entry
              </h2>
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVideo} className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Video Title <span className="text-red-500">*</span></label>
                <input 
                  type="text"
                  required
                  value={videoTitle}
                  onChange={e => setVideoTitle(e.target.value)}
                  placeholder="e.g. National President Address on Youth Leadership"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Video URL (YouTube or MP4) <span className="text-red-500">*</span></label>
                <input 
                  type="url"
                  required
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={videoCategory}
                    onChange={e => setVideoCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="General">General</option>
                    <option value="Speeches">Leader Speeches</option>
                    <option value="Interviews">Interviews & Media</option>
                    <option value="Conferences">Conferences</option>
                    <option value="Campaigns">Campaign Highlights</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Event Date</label>
                  <input 
                    type="date"
                    value={videoEventDate}
                    onChange={e => setVideoEventDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Video Thumbnail */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Custom Thumbnail (Optional)</label>
                <div className="flex items-center gap-4">
                  {thumbnailUrl ? (
                    <div className="relative w-28 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setThumbnailUrl("")}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null}

                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <input type="file" accept="image/*" className="hidden" disabled={isUploadingThumb} onChange={handleThumbnailUpload} />
                    {isUploadingThumb ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Upload className="w-4 h-4" />}
                    <span>{thumbnailUrl ? "Change Thumbnail" : "Upload Thumbnail"}</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                <textarea 
                  rows={3}
                  value={videoDescription}
                  onChange={e => setVideoDescription(e.target.value)}
                  placeholder="Summary of what is covered in this video..."
                  className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsVideoModalOpen(false)}
                  disabled={isSubmittingVideo}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary text-slate-950 hover:bg-primary/90 font-bold rounded-xl"
                  disabled={isSubmittingVideo || !videoTitle.trim() || !videoUrl.trim()}
                >
                  {isSubmittingVideo ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding Video...
                    </>
                  ) : (
                    "Publish Video"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
