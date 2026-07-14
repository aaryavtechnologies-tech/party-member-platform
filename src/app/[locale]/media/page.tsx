import { InnerPageHeader } from "@/components/layout/InnerPageHeader";
import { Media } from "@/components/sections/Media";

export default function MediaPage() {
  return (
    <main>
      <InnerPageHeader 
        title="Media & News" 
        description="Stay updated with the latest announcements, press releases, and galleries."
        breadcrumbs={[
          { label: "Media", href: "/media" }
        ]}
      />
      <div className="pt-10">
        <Media />
      </div>
    </main>
  );
}
