"use client";

import React, { useState, useRef } from "react";
import { Users, Save, X, Image as ImageIcon, Globe, Lock, Upload } from "lucide-react";
import { createCommunity } from "@/actions/communities/create";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "@/styles/designTokens.css";

export default function NewCommunityClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyType, setPrivacyType] = useState<"true" | "false">("true");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File exceeds 10MB limit");
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    let logoUrl = "";

    // Handle file upload first if a file was selected
    const fileField = formData.get("logoFile") as File;
    if (fileField && fileField.size > 0) {
      const uploadData = new FormData();
      uploadData.append("file", fileField);

      try {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        const uploadResult = await uploadRes.json();
        
        if (uploadResult.success) {
          logoUrl = uploadResult.url;
        } else {
          toast.error(uploadResult.error || "Failed to upload logo");
          setIsSubmitting(false);
          return;
        }
      } catch (err) {
        toast.error("Network error during file upload");
        setIsSubmitting(false);
        return;
      }
    }

    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      isPublic: formData.get("isPublic") === "true",
      logoUrl: logoUrl,
    };

    try {
      const res = await createCommunity(data);
      if (res.success) {
        toast.success("Community created successfully");
        router.push("/admin/communities");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create community");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 relative z-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center shrink-0">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Community Details</h2>
          <p className="text-slate-500 text-sm mt-1">Set up a new space for members to connect and collaborate.</p>
        </div>
      </div>

      <form onSubmit={handleCreate} className="p-8 space-y-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Community Name <span className="text-red-500">*</span>
              </label>
              <input 
                required 
                name="name" 
                type="text" 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                placeholder="e.g., Gujarat IT Cell" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea 
                name="description" 
                rows={5} 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none" 
                placeholder="Describe the purpose of this community..."
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                Community Logo (Optional)
              </label>
              
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0 bg-slate-50 dark:bg-slate-800/50 relative">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-slate-400 flex flex-col items-center">
                      <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Logo</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="relative group">
                    <input 
                      type="file" 
                      name="logoFile" 
                      id="logoFile"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                    <div className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl group-hover:border-primary group-hover:bg-primary/5 transition-all outline-none flex items-center gap-3 text-slate-600 dark:text-slate-400">
                      <Upload className="w-5 h-5 group-hover:text-primary transition-colors" />
                      <span className="font-medium group-hover:text-primary transition-colors">Choose an image file</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Recommended: Square image, PNG or JPG, max 10MB.</p>
                  
                  {previewUrl && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setPreviewUrl(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="mt-2 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                    >
                      Remove Image
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                Privacy Settings
              </label>
              <input type="hidden" name="isPublic" value={privacyType} />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPrivacyType("true")}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${privacyType === "true" ? "border-primary bg-primary/5" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className={`w-5 h-5 ${privacyType === "true" ? "text-primary" : "text-slate-400"}`} />
                    <span className={`font-bold ${privacyType === "true" ? "text-primary" : "text-slate-700 dark:text-slate-300"}`}>Public</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Anyone can see and join immediately.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPrivacyType("false")}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${privacyType === "false" ? "border-primary bg-primary/5" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-300"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className={`w-5 h-5 ${privacyType === "false" ? "text-primary" : "text-slate-400"}`} />
                    <span className={`font-bold ${privacyType === "false" ? "text-primary" : "text-slate-700 dark:text-slate-300"}`}>Private</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Requires admin approval to join.</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-end gap-4 mt-8">
          <Link 
            href="/admin/communities" 
            className="px-6 py-3 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" /> Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="px-8 py-3 bg-gradient-to-r from-primary to-orange-500 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(255,153,51,0.4)] disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            {isSubmitting ? "Creating..." : <><Save className="w-5 h-5" /> Save Community</>}
          </button>
        </div>
      </form>
    </div>
  );
}
