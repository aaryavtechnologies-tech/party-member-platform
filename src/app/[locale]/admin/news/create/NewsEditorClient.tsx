"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Send, Settings, Image as ImageIcon, LayoutTemplate } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { NewsCategory, NewsTag } from "@prisma/client";

export function NewsEditorClient({ categories, tags }: { categories: NewsCategory[], tags: NewsTag[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("content");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (status: "DRAFT" | "PUBLISHED") => {
    setIsSubmitting(true);
    // In a real implementation, we would collect all form data via react-hook-form
    // and send a POST request to a server action.
    toast.success(`Article saved as ${status}`);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/admin/news");
    }, 1000);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[600px]">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4">
        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
          <button 
            onClick={() => setActiveTab("content")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "content" ? 'bg-primary text-slate-950 shadow-sm' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <LayoutTemplate className="w-4 h-4" /> English Content
          </button>
          <button 
            onClick={() => setActiveTab("content-gu")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "content-gu" ? 'bg-primary text-slate-950 shadow-sm' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <LayoutTemplate className="w-4 h-4" /> Gujarati Content
          </button>
          <button 
            onClick={() => setActiveTab("media")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "media" ? 'bg-primary text-slate-950 shadow-sm' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <ImageIcon className="w-4 h-4" /> Media & Gallery
          </button>
          <button 
            onClick={() => setActiveTab("seo")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "seo" ? 'bg-primary text-slate-950 shadow-sm' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <Settings className="w-4 h-4" /> SEO & Settings
          </button>
        </nav>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 sm:p-8">
          
          {/* CONTENT TAB */}
          {(activeTab === "content" || activeTab === "content-gu") && (
            <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-bold">
                {activeTab === "content" ? "English Content" : "Gujarati Content"}
              </h2>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Article Title</label>
                <input 
                  type="text" 
                  placeholder="Enter a compelling title..." 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Short Summary</label>
                <textarea 
                  rows={3}
                  placeholder="A brief summary for the news cards..." 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Content (Tiptap Editor Placeholder)</label>
                <div className="min-h-[300px] w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center p-8 text-center text-slate-500">
                  <p>Enterprise Rich Text Editor initialized here.<br/>(Supports Tables, Images, YouTube embeds, etc)</p>
                </div>
              </div>
            </div>
          )}

          {/* MEDIA TAB */}
          {activeTab === "media" && (
            <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-bold">Media & Gallery</h2>
              
              <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center bg-slate-50 dark:bg-slate-900/50">
                <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Featured Image</h3>
                <p className="text-slate-500 text-sm mb-4">Upload or select from VPS Local Storage</p>
                <Button variant="outline">Browse Media Library</Button>
              </div>

              <div className="p-8 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-950">
                <h3 className="text-lg font-bold mb-4">Photo Gallery (Optional)</h3>
                <p className="text-slate-500 text-sm mb-4">Attach multiple images to create an inline masonry gallery.</p>
                <Button variant="outline">Add Images to Gallery</Button>
              </div>
            </div>
          )}

          {/* SEO TAB */}
          {activeTab === "seo" && (
            <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-bold">Publishing Settings & SEO</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Category</label>
                  <select className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Select Category...</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Tags</label>
                  <select className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Select Tags...</option>
                    {tags.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="font-bold">Flags</h3>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20" />
                    <span className="font-medium">Mark as Press Release</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20" />
                    <span className="font-medium">Featured (Homepage)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex justify-between items-center">
          <Button 
            variant="ghost" 
            className="text-slate-500" 
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="rounded-xl"
              onClick={() => handleSave("DRAFT")}
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" /> Save Draft
            </Button>
            <Button 
              className="bg-primary text-slate-950 hover:bg-primary/90 rounded-xl font-bold"
              onClick={() => handleSave("PUBLISHED")}
              disabled={isSubmitting}
            >
              <Send className="w-4 h-4 mr-2" /> Publish Article
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
}
