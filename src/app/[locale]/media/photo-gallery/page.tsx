import { InnerPageHeader } from "@/components/layout/InnerPageHeader";

export default function PhotoGalleryPage() {
  return (
    <main>
      <InnerPageHeader 
        title="Photo Gallery" 
        description="Visual highlights from our campaigns, events, and community service."
        breadcrumbs={[
          { label: "Media", href: "/media" },
          { label: "Photo Gallery", href: "/media/photo-gallery" }
        ]}
      />
      <div className="py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl text-slate-500">Photo masonry grid will be displayed here.</p>
        </div>
      </div>
    </main>
  );
}
