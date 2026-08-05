"use client";

import { useState } from "react";
import { Play, X, Filter, Video as VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoGalleryItem {
  id: string;
  url: string;
  title: string;
  category: string;
  source: string;
  thumbnail: string | null;
  date: Date | string;
}

interface VideoGridProps {
  videos: VideoGalleryItem[];
}

// Helper to extract YouTube ID for iframe embedding
function getYouTubeID(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function VideoGrid({ videos }: VideoGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedVideo, setSelectedVideo] = useState<VideoGalleryItem | null>(null);

  const categories = ["All", ...Array.from(new Set(videos.map(v => v.category))).filter(Boolean)];

  const filteredVideos = selectedCategory === "All" 
    ? videos 
    : videos.filter(v => v.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-red-600" />
          <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">Filter by Event</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                selectedCategory === cat 
                  ? "bg-red-600 text-white shadow-md shadow-red-500/20" 
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-red-400 hover:text-red-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <VideoIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-semibold text-lg">No videos found for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((vid) => (
            <div 
              key={vid.id}
              onClick={() => setSelectedVideo(vid)}
              className="relative group overflow-hidden rounded-2xl cursor-pointer border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex flex-col"
            >
              {/* Thumbnail Container */}
              <div className="aspect-video relative overflow-hidden bg-black flex-shrink-0">
                {vid.thumbnail ? (
                  <img 
                    src={vid.thumbnail} 
                    alt={vid.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out opacity-80 group-hover:opacity-100"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800">
                    <VideoIcon className="w-12 h-12 text-slate-600" />
                  </div>
                )}
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-red-600/90 text-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 ml-1" />
                  </div>
                </div>
              </div>
              
              {/* Text Content */}
              <div className="p-5 flex-1 flex flex-col justify-between bg-white dark:bg-slate-950 group-hover:bg-slate-50 dark:group-hover:bg-slate-900/50 transition-colors">
                <div>
                  <span className="text-red-500 text-xs font-bold uppercase tracking-wider mb-2 block">{vid.category}</span>
                  <h4 className="text-slate-900 dark:text-white font-bold leading-snug line-clamp-2">{vid.title}</h4>
                </div>
                <p className="text-slate-500 text-sm mt-3 font-medium">
                  {new Date(vid.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Video Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-50 rounded-full w-12 h-12"
            onClick={() => setSelectedVideo(null)}
          >
            <X className="w-8 h-8" />
          </Button>
          
          <div className="relative w-full max-w-5xl flex flex-col justify-center items-center">
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
              {getYouTubeID(selectedVideo.url) ? (
                <iframe 
                  src={`https://www.youtube.com/embed/${getYouTubeID(selectedVideo.url)}?autoplay=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video 
                  src={selectedVideo.url}
                  className="w-full h-full"
                  controls
                  autoPlay
                ></video>
              )}
            </div>
            <div className="mt-6 w-full text-left">
              <span className="inline-block px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                {selectedVideo.category}
              </span>
              <h3 className="text-white text-2xl sm:text-3xl font-black">{selectedVideo.title}</h3>
              <p className="text-slate-400 mt-2 font-medium">
                Published on {new Date(selectedVideo.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
