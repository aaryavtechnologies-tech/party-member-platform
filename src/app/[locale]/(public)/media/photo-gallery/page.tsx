import { Metadata } from "next";
import { fetchPhotoGallery } from "@/actions/public/gallery";
import { GalleryGrid } from "@/components/media/GalleryGrid";
import { Image as ImageIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Photo Gallery - Rashtriya Annadata Vikas Party (RAVP)",
  description: "Preserving Every Moment, Inspiring Public Service. Explore photographs from national, state, and village level programs of RAVP.",
};

export default async function PhotoGalleryPage() {
  const images = await fetchPhotoGallery();

  return (
    <main className="bg-white dark:bg-slate-950 min-h-screen pt-32 pb-20">
      
      {/* Hero Banner */}
      <div className="bg-blue-900 text-white py-16 mb-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <ImageIcon className="w-16 h-16 text-blue-300 mx-auto mb-6" />
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-blue-200 mb-4">Official Media</h2>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            Photo Gallery
          </h1>
          <p className="text-blue-100 text-xl font-serif italic max-w-2xl mx-auto">
            "Preserving Every Moment, Inspiring Public Service."
          </p>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-8 rounded-full" />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Intro Text */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <p className="text-lg text-slate-600 dark:text-slate-400">
            The Photo Gallery showcases photographs from various programs and activities organized by the **Rashtriya Annadata Vikas Party (RAVP)**, including public meetings, membership registration campaigns, farmers' conventions, social service initiatives, and other significant events.
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-bold">
            A single photograph can communicate dedication, service, and achievements more effectively than thousands of words.
          </p>
        </div>

        {/* Gallery Grid Client Component */}
        <GalleryGrid images={images.map(img => ({ ...img, date: img.date.toISOString() }))} />
      </div>

    </main>
  );
}
