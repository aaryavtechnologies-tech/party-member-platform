import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";

export default function CreateVideoPage() {
  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />

      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-xl font-bold mb-4">Add Standalone Video</h2>
        <p className="text-slate-500 mb-8">This page is currently a placeholder for the video creation form. In a complete implementation, this would allow you to paste a YouTube link, and the system would automatically fetch the thumbnail and populate the video details.</p>
        
        <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
          <p className="text-sm font-bold text-slate-400">Standalone Video Creation UI coming soon.</p>
        </div>
      </div>
    </div>
  );
}
