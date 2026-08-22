"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Send, Settings, Image as ImageIcon, LayoutTemplate, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { NewsCategory, NewsTag } from "@prisma/client";
import { TiptapEditor } from "@/components/admin/TiptapEditor";
import { updateNewsArticle } from "@/actions/admin/news";

export function NewsEditClient({ 
  article,
  categories, 
  tags,
  canFeature = false,
  canBreak = false
}: { 
  article: any,
  categories: NewsCategory[], 
  tags: NewsTag[],
  canFeature?: boolean,
  canBreak?: boolean
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("content");
  const [submittingAction, setSubmittingAction] = useState<"SAVE" | "PUBLISH" | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Extract initial translations
  const initialEn = article.translations?.find((t: any) => t.language === "en");
  const initialGu = article.translations?.find((t: any) => t.language === "gu");

  // English Content State
  const [title, setTitle] = useState(initialEn?.title || "");
  const [slug, setSlug] = useState(initialEn?.slug || "");
  const [summary, setSummary] = useState(initialEn?.summary || "");
  const [content, setContent] = useState(initialEn?.content || "");

  // Gujarati Content State
  const [titleGu, setTitleGu] = useState(initialGu?.title || "");
  const [slugGu, setSlugGu] = useState(initialGu?.slug || "");
  const [summaryGu, setSummaryGu] = useState(initialGu?.summary || "");
  const [contentGu, setContentGu] = useState(initialGu?.content || "");

  // Featured Media & Taxonomy
  const [imageUrl, setImageUrl] = useState(article.featuredImage || "");
  const [categoryId, setCategoryId] = useState(article.categories?.[0]?.id || "");
  const [tagId, setTagId] = useState(article.tags?.[0]?.id || "");

  // Media Contact
  const [contactName, setContactName] = useState(article.contactName || "");
  const [contactDesignation, setContactDesignation] = useState(article.contactDesignation || "");
  const [contactEmail, setContactEmail] = useState(article.contactEmail || "");
  const [contactMobile, setContactMobile] = useState(article.contactMobile || "");
  
  // Flags
  const [isPressRelease, setIsPressRelease] = useState(article.isPressRelease || false);
  const [isFeatured, setIsFeatured] = useState(article.isFeatured || false);
  const [isBreaking, setIsBreaking] = useState(article.isBreaking || false);
  const [isMemberOnly, setIsMemberOnly] = useState(article.isMemberOnly || false);

  const isSubmitting = submittingAction !== null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
      }
      const data = await res.json();
      setImageUrl(data.url);
      toast.success("Featured image updated successfully");
    } catch (err: any) {
      console.error("Featured image upload error:", err);
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async (statusOverride?: "DRAFT" | "PUBLISHED") => {
    const actionType = statusOverride === "PUBLISHED" ? "PUBLISH" : "SAVE";
    setSubmittingAction(actionType);
    
    try {
      const actualSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const actualSlugGu = slugGu || (titleGu ? titleGu.toLowerCase().replace(/[^a-z0-9\u0A80-\u0AFF]+/g, '-').replace(/(^-|-$)+/g, '') : "");
      
      await updateNewsArticle(article.id, {
        title,
        slug: actualSlug,
        summary,
        content,
        titleGu: titleGu || undefined,
        slugGu: actualSlugGu || undefined,
        summaryGu: summaryGu || undefined,
        contentGu: contentGu || undefined,
        isFeatured,
        isBreaking,
        isPressRelease,
        isMemberOnly,
        featuredImage: imageUrl,
        categoryId: categoryId || undefined,
        tagId: tagId || undefined,
        contactName: contactName || undefined,
        contactDesignation: contactDesignation || undefined,
        contactEmail: contactEmail || undefined,
        contactMobile: contactMobile || undefined,
      }, statusOverride);
      
      toast.success("Article updated successfully!");
      router.push("/admin/news");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update article");
    } finally {
      setSubmittingAction(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[600px]">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4">
        <div className="mb-4 px-2">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
            article.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 
            article.status === 'PENDING_APPROVAL' ? 'bg-orange-100 text-orange-700' :
            'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}>
            Current Status: {article.status.replace("_", " ")}
          </span>
        </div>

        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
          <button 
            type="button"
            onClick={() => setActiveTab("content")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "content" ? 'bg-primary text-slate-950 shadow-sm font-bold' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <LayoutTemplate className="w-4 h-4" /> English Content
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("content-gu")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "content-gu" ? 'bg-primary text-slate-950 shadow-sm font-bold' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <LayoutTemplate className="w-4 h-4" /> Gujarati Content
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("media")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "media" ? 'bg-primary text-slate-950 shadow-sm font-bold' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <ImageIcon className="w-4 h-4" /> Media & Cover
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("seo")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === "seo" ? 'bg-primary text-slate-950 shadow-sm font-bold' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <Settings className="w-4 h-4" /> SEO & Settings
          </button>
        </nav>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 sm:p-8">
          
          {/* ENGLISH CONTENT TAB */}
          {activeTab === "content" && (
            <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Edit English Content</h2>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-slate-600 dark:text-slate-400 font-medium">Primary Language</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Article Title (English) <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={title}
                  disabled={isSubmitting}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Enter article title..." 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Slug (URL)</label>
                <input 
                  type="text" 
                  value={slug}
                  disabled={isSubmitting}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="article-slug-url" 
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 text-slate-600 dark:text-slate-400 font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Short Summary (English)</label>
                <textarea 
                  rows={3}
                  value={summary}
                  disabled={isSubmitting}
                  onChange={e => setSummary(e.target.value)}
                  placeholder="A brief English summary for news cards..." 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Content (English)</label>
                <TiptapEditor content={content} onChange={setContent} />
              </div>
            </div>
          )}

          {/* GUJARATI CONTENT TAB */}
          {activeTab === "content-gu" && (
            <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Edit Gujarati Content (ગુજરાતી)</h2>
                <span className="text-xs bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-full font-medium">Regional Language</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">લેખનું શીર્ષક (Article Title)</label>
                <input 
                  type="text" 
                  value={titleGu}
                  disabled={isSubmitting}
                  onChange={e => setTitleGu(e.target.value)}
                  placeholder="સમાચારનું શીર્ષક દાખલ કરો..." 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ટૂંકો સારાંશ (Short Summary)</label>
                <textarea 
                  rows={3}
                  value={summaryGu}
                  disabled={isSubmitting}
                  onChange={e => setSummaryGu(e.target.value)}
                  placeholder="સમાચાર કાર્ડ માટે સંક્ષિપ્ત સારાંશ..." 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">સંપૂર્ણ વિગતો (Full Content)</label>
                <TiptapEditor content={contentGu} onChange={setContentGu} />
              </div>
            </div>
          )}

          {/* MEDIA TAB */}
          {activeTab === "media" && (
            <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-bold">Media & Cover Image</h2>
              
              <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center bg-slate-50 dark:bg-slate-900/50">
                {imageUrl ? (
                  <div className="relative inline-block mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Featured" className="mx-auto max-h-56 rounded-lg object-cover shadow-md border border-slate-200 dark:border-slate-700" />
                    <button 
                      type="button" 
                      onClick={() => setImageUrl("")}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                )}
                <h3 className="text-lg font-bold mb-2">Featured Cover Image</h3>
                <p className="text-slate-500 text-sm mb-4">Upload a high-quality image (JPEG, PNG, WebP, GIF up to 5MB)</p>
                <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium transition-colors ${isUploadingImage ? 'bg-slate-100 dark:bg-slate-800 opacity-60 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  <input type="file" className="hidden" accept="image/*" disabled={isUploadingImage} onChange={handleImageUpload} />
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>{imageUrl ? "Replace Image" : "Upload Image"}</span>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* SEO TAB */}
          {activeTab === "seo" && (
            <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-bold">Publishing Settings & SEO</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Category</label>
                  <select 
                    value={categoryId} 
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select Category...</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Tags</label>
                  <select 
                    value={tagId} 
                    onChange={e => setTagId(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select Tags...</option>
                    {tags.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="font-bold">Flags</h3>
                <div className="flex flex-col sm:flex-row gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isPressRelease} onChange={e => setIsPressRelease(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20" />
                    <span className="font-medium">Mark as Press Release</span>
                  </label>
                  
                  {canFeature && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20" />
                      <span className="font-medium">Featured (Homepage)</span>
                    </label>
                  )}
                  
                  {canBreak && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={isBreaking} onChange={e => setIsBreaking(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20" />
                      <span className="font-medium">Breaking News Bar</span>
                    </label>
                  )}
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isMemberOnly} onChange={e => setIsMemberOnly(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20" />
                    <span className="font-medium">Member Only</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="font-bold">Media Contact (For Press Releases)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Spokesperson Name</label>
                    <input 
                      type="text" 
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      placeholder="e.g. Ramesh Patel" 
                      className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Designation</label>
                    <input 
                      type="text" 
                      value={contactDesignation}
                      onChange={e => setContactDesignation(e.target.value)}
                      placeholder="e.g. National Media Coordinator" 
                      className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Email Address</label>
                    <input 
                      type="email" 
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      placeholder="media@ravp.org" 
                      className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Mobile Number</label>
                    <input 
                      type="text" 
                      value={contactMobile}
                      onChange={e => setContactMobile(e.target.value)}
                      placeholder="+91 XXXXX XXXXX" 
                      className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" 
                    />
                  </div>
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
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="rounded-xl min-w-[130px]"
              onClick={() => handleSave()}
              disabled={isSubmitting || !title.trim()}
            >
              {submittingAction === "SAVE" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-700 dark:text-slate-300" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
            {article.status !== "PUBLISHED" && (
              <Button 
                className="bg-primary text-slate-950 hover:bg-primary/90 rounded-xl font-bold min-w-[160px] shadow-sm disabled:opacity-50"
                onClick={() => handleSave("PUBLISHED")}
                disabled={isSubmitting || !title.trim()}
              >
                {submittingAction === "PUBLISH" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-950" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    <span>Save & Publish</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
