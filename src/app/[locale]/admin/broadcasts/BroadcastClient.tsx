"use client";

import { useState } from "react";
import { Send, Users, ShieldAlert, Globe, Link2, Type, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { sendBroadcast } from "@/actions/admin/broadcasts";

export default function BroadcastClient({ adminCount, memberCount }: { adminCount: number, memberCount: number }) {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    audience: "ALL" as "ALL" | "MEMBER_ONLY" | "ADMIN_ONLY",
    imageUrl: "",
    fileUrl: ""
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      toast.error("Title and message are required.");
      return;
    }

    if (!confirm(`Are you sure you want to send this broadcast to ${formData.audience}? This action cannot be undone.`)) {
      return;
    }

    setIsSending(true);
    try {
      await sendBroadcast(formData);
      toast.success("Broadcast sent successfully!");
      setFormData({
        title: "",
        message: "",
        audience: "ALL",
        imageUrl: "",
        fileUrl: ""
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to send broadcast");
    } finally {
      setIsSending(false);
    }
  };

  const audienceStats = {
    ALL: adminCount + memberCount,
    MEMBER_ONLY: memberCount,
    ADMIN_ONLY: adminCount,
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "file") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "image") setIsUploadingImage(true);
    else setIsUploadingFile(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      
      if (type === "image") setFormData(prev => ({ ...prev, imageUrl: data.url }));
      else setFormData(prev => ({ ...prev, fileUrl: data.url }));
      
      toast.success(`${type === "image" ? "Image" : "File"} uploaded successfully`);
    } catch (err) {
      toast.error(`Failed to upload ${type}`);
    } finally {
      if (type === "image") setIsUploadingImage(false);
      else setIsUploadingFile(false);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-primary"></div>
          
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" /> Compose Broadcast
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Type className="w-3 h-3" /> Notification Title
              </label>
              <input 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Urgent Meeting for all District Presidents"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <MessageSquare className="w-3 h-3" /> Message Body
              </label>
              <textarea 
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Type your message here..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Target Audience
                </label>
                <select 
                  value={formData.audience}
                  onChange={(e: any) => setFormData({...formData, audience: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="ALL">Everyone (Members + Admins)</option>
                  <option value="MEMBER_ONLY">Registered Members Only</option>
                  <option value="ADMIN_ONLY">System Admins Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Attach Image (Optional)
                </label>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={e => handleUpload(e, "image")}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none"
                />
                {isUploadingImage && <p className="text-xs text-primary mt-1">Uploading image...</p>}
                {formData.imageUrl && <p className="text-xs text-green-600 mt-1">Image attached</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Attach Document/File (Optional)
              </label>
              <input 
                type="file"
                onChange={e => handleUpload(e, "file")}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none"
              />
              {isUploadingFile && <p className="text-xs text-primary mt-1">Uploading file...</p>}
              {formData.fileUrl && <p className="text-xs text-green-600 mt-1">File attached</p>}
            </div>
            
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
              <button 
                type="submit" 
                disabled={isSending}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Dispatching...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" /> Send Broadcast to {audienceStats[formData.audience].toLocaleString()} people
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      <div className="space-y-6">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Audience Reach</h3>
          
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border ${formData.audience === 'ALL' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950'} transition-all flex justify-between items-center`}>
              <div className="flex items-center gap-3">
                <Globe className={`w-5 h-5 ${formData.audience === 'ALL' ? 'text-primary' : 'text-slate-400'}`} />
                <span className="font-bold">Everyone</span>
              </div>
              <span className="font-black font-mono text-lg">{audienceStats.ALL.toLocaleString()}</span>
            </div>

            <div className={`p-4 rounded-xl border ${formData.audience === 'MEMBER_ONLY' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950'} transition-all flex justify-between items-center`}>
              <div className="flex items-center gap-3">
                <Users className={`w-5 h-5 ${formData.audience === 'MEMBER_ONLY' ? 'text-primary' : 'text-slate-400'}`} />
                <span className="font-bold">Members</span>
              </div>
              <span className="font-black font-mono text-lg">{audienceStats.MEMBER_ONLY.toLocaleString()}</span>
            </div>

            <div className={`p-4 rounded-xl border ${formData.audience === 'ADMIN_ONLY' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950'} transition-all flex justify-between items-center`}>
              <div className="flex items-center gap-3">
                <ShieldAlert className={`w-5 h-5 ${formData.audience === 'ADMIN_ONLY' ? 'text-primary' : 'text-slate-400'}`} />
                <span className="font-bold">Admins</span>
              </div>
              <span className="font-black font-mono text-lg">{audienceStats.ADMIN_ONLY.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed font-medium">
              <strong className="block mb-1">Notice:</strong>
              Broadcasts are delivered instantly to the users' in-app notification center. For members over 10,000, the system batches the delivery to prevent server timeout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
