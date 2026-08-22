"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAdminEvent } from "@/actions/admin/events";
import { toast } from "sonner";
import { Calendar as CalendarIcon, MapPin, Users, Save } from "lucide-react";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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
      toast.success("Event cover image uploaded successfully");
    } catch (err: any) {
      console.error("Cover image upload error:", err);
      toast.error(err.message || "Failed to upload cover image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      await createAdminEvent({
        ...data,
        imageUrl: imageUrl || undefined,
      });
      toast.success("Event created successfully");
      router.push("/admin/events");
    } catch (err: any) {
      toast.error(err.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 pb-24">
      <AdminBreadcrumbs />

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" /> Create New Event
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Cover Image Upload */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Event Cover Image</h3>
            <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center bg-slate-50 dark:bg-slate-950/50">
              {imageUrl ? (
                <div className="relative inline-block mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Event Cover" className="mx-auto max-h-56 rounded-xl object-cover shadow-md border border-slate-200 dark:border-slate-700" />
                  <button 
                    type="button" 
                    onClick={() => setImageUrl("")}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors"
                    title="Remove cover image"
                  >
                    ✕
                  </button>
                </div>
              ) : null}
              
              <div>
                <label className={`cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold shadow-sm transition-colors ${isUploadingImage ? 'opacity-60 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  <input type="file" className="hidden" accept="image/*" disabled={isUploadingImage} onChange={handleImageUpload} />
                  <span>{isUploadingImage ? "Uploading Cover..." : imageUrl ? "Change Cover Image" : "Upload Event Cover Image"}</span>
                </label>
                <p className="text-xs text-slate-400 mt-2">JPEG, PNG, WebP or GIF up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Basic Info</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Event Title *</label>
              <Input name="title" required placeholder="Enter event title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description *</label>
              <textarea 
                name="description" 
                required 
                rows={4}
                className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="Detailed description of the event..."
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Schedule & Venue</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date *</label>
                <Input type="date" name="date" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                <Input type="time" name="startTime" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                <Input type="time" name="endTime" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Venue / Address</label>
              <Input name="venue" placeholder="Hall name, Street address..." />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Registration</h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="registrationRequired" value="true" className="rounded border-slate-300 text-primary focus:ring-primary" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Requires Registration</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Participants</label>
                <Input type="number" name="maxParticipants" placeholder="Leave blank for unlimited" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Person / Phone</label>
                <Input name="contactPerson" placeholder="Who to contact for queries" />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-primary text-slate-950 font-bold px-8">
              {loading ? "Creating..." : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Publish Event
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
