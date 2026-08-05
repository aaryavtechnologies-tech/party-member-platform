"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { upsertCmsPage } from "@/actions/admin/cms";
import { Save, Globe, Eye, Settings, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

type TranslationData = {
  language: string;
  title: string;
  slug: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
};

export default function CMSPageEditorClient({ initialData, locale }: { initialData: any, locale: string }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<string>("en");
  
  const [status, setStatus] = useState(initialData?.status || "DRAFT");
  
  // Initialize translations state
  const [translations, setTranslations] = useState<Record<string, TranslationData>>(() => {
    const defaultData = {
      en: { language: "en", title: "", slug: "", content: "", seoTitle: "", seoDescription: "" },
      gu: { language: "gu", title: "", slug: "", content: "", seoTitle: "", seoDescription: "" }
    };
    if (initialData?.translations) {
      initialData.translations.forEach((t: any) => {
        defaultData[t.language as "en" | "gu"] = {
          language: t.language,
          title: t.title || "",
          slug: t.slug || "",
          content: t.content || "",
          seoTitle: t.seoTitle || "",
          seoDescription: t.seoDescription || ""
        };
      });
    }
    return defaultData;
  });

  const activeTranslation = translations[activeLang];

  const updateActiveTranslation = (field: keyof TranslationData, value: string) => {
    setTranslations(prev => ({
      ...prev,
      [activeLang]: {
        ...prev[activeLang],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Basic validation on English required
      if (!translations.en.title || !translations.en.slug) {
        toast.error("English Title and Slug are required.");
        setActiveLang("en");
        setIsSaving(false);
        return;
      }

      const translationsArray = Object.values(translations).filter(t => t.title && t.slug);

      const res = await upsertCmsPage({
        id: initialData?.id,
        status,
        translations: translationsArray
      });

      if (res.success) {
        toast.success("Page saved successfully!");
        router.push("/admin/cms/pages");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save page.");
      }
    } catch (e) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <AdminBreadcrumbs />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {initialData ? "Edit Page" : "Create New Page"}
          </h1>
          <p className="text-slate-500">Design and publish content using the rich text editor.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
            <button 
              onClick={() => setActiveLang("en")}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeLang === "en" ? "bg-white dark:bg-slate-800 shadow-sm text-primary" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
            >
              English
            </button>
            <button 
              onClick={() => setActiveLang("gu")}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeLang === "gu" ? "bg-white dark:bg-slate-800 shadow-sm text-primary" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
            >
              Gujarati
            </button>
          </div>
          
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-primary text-slate-950 font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Page"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Page Title</label>
                <input
                  type="text"
                  value={activeTranslation.title}
                  onChange={(e) => {
                    updateActiveTranslation("title", e.target.value);
                    if (!initialData && activeLang === "en") {
                      // auto-slug
                      updateActiveTranslation("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                    }
                  }}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 text-xl"
                  placeholder="e.g. About Our Journey"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">URL Slug</label>
                <div className="flex items-center">
                  <span className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border border-r-0 border-slate-200 dark:border-slate-800 rounded-l-xl text-slate-500 font-mono text-sm">
                    /p/
                  </span>
                  <input
                    type="text"
                    value={activeTranslation.slug}
                    onChange={(e) => updateActiveTranslation("slug", e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-r-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="about-our-journey"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Page Content</label>
              <RichTextEditor 
                content={activeTranslation.content}
                onChange={(html) => updateActiveTranslation("content", html)}
                onImageUpload={() => {
                  toast.error("Media Library integration coming soon!");
                }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* SEO Settings */}
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-slate-400" />
              <h3 className="font-bold">SEO Settings</h3>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Meta Title</label>
              <input
                type="text"
                value={activeTranslation.seoTitle}
                onChange={(e) => updateActiveTranslation("seoTitle", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-primary"
                placeholder="Optional meta title"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Meta Description</label>
              <textarea
                value={activeTranslation.seoDescription}
                onChange={(e) => updateActiveTranslation("seoDescription", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
                placeholder="Brief description for search engines..."
              />
            </div>
          </div>
          
          {/* Page Info */}
          {initialData && (
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold">Page Info</h3>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Created:</span>
                <span className="font-medium">{new Date(initialData.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Last Modified:</span>
                <span className="font-medium">{new Date(initialData.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                <a 
                  href={`/${locale}/p/${translations.en.slug}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Eye className="w-4 h-4" /> View Live Page
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
