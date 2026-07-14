import { InnerPageHeader } from "@/components/layout/InnerPageHeader";

export default function NewsPage() {
  return (
    <main>
      <InnerPageHeader 
        title="News & Updates" 
        description="The latest news, announcements, and coverage from our initiatives nationwide."
        breadcrumbs={[
          { label: "Media", href: "/media" },
          { label: "News", href: "/media/news" }
        ]}
      />
      <div className="py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl text-slate-500">News archive will be displayed here.</p>
        </div>
      </div>
    </main>
  );
}
