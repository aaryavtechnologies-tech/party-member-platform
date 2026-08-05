import { Metadata } from "next";
import { fetchVideoGallery } from "@/actions/public/video-gallery";
import { VideoGrid } from "@/components/media/VideoGrid";
import { Video as VideoIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Video Gallery - Rashtriya Annadata Vikas Party (RAVP)",
  description: "Every Video Inspires, Every Moment Reflects Service. Watch videos from national, state, and village level programs of RAVP.",
};

export default async function VideoGalleryPage() {
  const videos = await fetchVideoGallery();

  return (
    <main className="bg-white dark:bg-slate-950 min-h-screen pt-32 pb-20">
      
      {/* Hero Banner */}
      <div className="bg-slate-900 text-white py-16 mb-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <VideoIcon className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-red-400 mb-4">Official Media</h2>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            Video Gallery
          </h1>
          <p className="text-slate-300 text-xl font-serif italic max-w-2xl mx-auto">
            "Every Video Inspires, Every Moment Reflects Service."
          </p>
          <div className="w-24 h-1 bg-red-600 mx-auto mt-8 rounded-full" />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Intro Text */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <p className="text-lg text-slate-600 dark:text-slate-400">
            The Video Gallery features videos of various programs and events organized by the **Rashtriya Annadata Vikas Party (RAVP)**. The purpose of this section is to present the party's activities in a more engaging, transparent, and dynamic way.
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-bold">
            The journey of public service is no longer told only through words, but through living visuals.
          </p>
        </div>

        {/* Video Grid Client Component */}
        <VideoGrid videos={videos.map(vid => ({ ...vid, date: vid.date.toISOString() }))} />
      </div>

    </main>
  );
}
