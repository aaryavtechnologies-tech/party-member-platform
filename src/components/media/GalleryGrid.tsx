"use client";

import { useState } from "react";
import { Image as ImageIcon, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
  source: string;
  date: Date | string;
}

interface GalleryGridProps {
  images: GalleryImage[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const categories = ["All", ...Array.from(new Set(images.map(img => img.category))).filter(Boolean)];

  const filteredImages = selectedCategory === "All" 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">Filter by Event</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                selectedCategory === cat 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      {filteredImages.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-semibold text-lg">No photos found for this category.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((img) => (
            <div 
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className="relative group overflow-hidden rounded-2xl cursor-zoom-in break-inside-avoid border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
            >
              {/* Image */}
              <img 
                src={img.url} 
                alt={img.title}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">{img.category}</span>
                <h4 className="text-white font-bold leading-tight">{img.title}</h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-50 rounded-full w-12 h-12"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </Button>
          
          <div className="relative max-w-7xl max-h-screen flex flex-col justify-center items-center">
            <img 
              src={selectedImage.url} 
              alt={selectedImage.title}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <div className="mt-6 text-center">
              <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                {selectedImage.category}
              </span>
              <h3 className="text-white text-xl sm:text-3xl font-black">{selectedImage.title}</h3>
              <p className="text-slate-400 mt-2 font-medium">
                {new Date(selectedImage.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
