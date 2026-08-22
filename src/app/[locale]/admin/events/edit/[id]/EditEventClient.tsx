"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateAdminEvent } from "@/actions/admin/events";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Save, Loader2, Trash2 } from "lucide-react";

export function EditEventClient({ event }: { event: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const initialDateStr = event.date ? new Date(event.date).toISOString().split("T")[0] : "";
  const [imageUrl, setImageUrl] = useState(event.imageUrl || "");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [title, setTitle] = useState(event.title || "");
  const [description, setDescription] = useState(event.description || "");
  const [date, setDate] = useState(initialDateStr);
  const [startTime, setStartTime] = useState(event.startTime || "");
  const [endTime, setEndTime] = useState(event.endTime || "");
  const [venue, setVenue] = useState(event.venue || "");
  const [registrationRequired, setRegistrationRequired] = useState(event.registrationRequired || false);
  const [maxParticipants, setMaxParticipants] = useState(event.maxParticipants ? String(event.maxParticipants) : "");
  const [contactPerson, setContactPerson] = useState(event.contactPerson || "");
  const [organizer, setOrganizer] = useState(event.organizer || "");
  const [status, setStatus] = useState(event.status || "PUBLISHED");

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
      toast.success("Event cover image updated successfully");
    } catch (err: any) {
      console.error("Cover image upload error:", err);
      toast.error(err.message || "Failed to upload cover image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateAdminEvent(event.id, {
        title,
        description,
        date,
        startTime,
        endTime,
        venue,
        imageUrl,
        registrationRequired,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        contactPerson,
        organizer,
        status,
      });
      toast.success("Event updated successfully!");
      router.push("/admin/events");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 pb-24">
      <AdminBreadcrumbs />

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" /> Edit Event
          </h2>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            status === 'PUBLISHED' ? 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300' :
            status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300' :
            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}>
            {status}
          </span>
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
                    <Trash2 className="w-4 h-4" />
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
              <Input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
                placeholder="Enter event title" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description *</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                required 
                rows={4}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="Detailed description of the event..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Organizer (Optional)</label>
                <Input 
                  value={organizer} 
                  onChange={e => setOrganizer(e.target.value)}
                  placeholder="e.g. State Youth Wing" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Schedule & Venue</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date *</label>
                <Input 
                  type="date" 
                  value={date} 
                  onChange={e => setDate(e.target.value)}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                <Input 
                  type="time" 
                  value={startTime} 
                  onChange={e => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                <Input 
                  type="time" 
                  value={endTime} 
                  onChange={e => setEndTime(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Venue / Address</label>
              <Input 
                value={venue} 
                onChange={e => setVenue(e.target.value)}
                placeholder="Hall name, Street address..." 
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Registration</h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={registrationRequired} 
                  onChange={e => setRegistrationRequired(e.target.checked)}
                  className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4" 
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Requires Registration</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Participants</label>
                <Input 
                  type="number" 
                  value={maxParticipants} 
                  onChange={e => setMaxParticipants(e.target.value)}
                  placeholder="Leave blank for unlimited" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Person / Phone</label>
                <Input 
                  value={contactPerson} 
                  onChange={e => setContactPerson(e.target.value)}
                  placeholder="Who to contact for queries" 
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !title.trim() || !date} 
              className="bg-primary text-slate-950 font-bold px-8 rounded-xl shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Update Event
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
