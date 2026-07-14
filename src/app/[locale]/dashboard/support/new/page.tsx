"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { UploadCloud, File as FileIcon, X, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/routing";

const ticketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  priority: z.string().min(1, "Please select a priority"),
  description: z.string().min(20, "Please provide more details (minimum 20 characters)"),
});

type TicketData = z.infer<typeof ticketSchema>;

export default function CreateTicketPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<TicketData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: "",
      category: "",
      priority: "Medium",
      description: ""
    }
  });

  const onSubmit = async (data: TicketData) => {
    try {
      setIsUploading(true);
      let attachmentUrl = "";

      // Handle local file upload
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });
        
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          attachmentUrl = uploadData.url;
        } else {
          alert("File upload failed!");
          setIsUploading(false);
          return;
        }
      }

      console.log("Submitting Ticket:", { ...data, attachmentUrl });
      // TODO: Submit to Database Server Action
      
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 pt-20">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Ticket Submitted Successfully!</h1>
        <p className="text-slate-500 text-lg">Your support ticket has been created and assigned an ID. Our team will review it shortly.</p>
        <div className="pt-8 flex justify-center gap-4">
          <Link href="/dashboard/support">
            <Button variant="outline" className="h-12 px-8 rounded-full font-bold">Back to Tickets</Button>
          </Link>
          <Button className="h-12 px-8 rounded-full font-bold bg-primary text-slate-950">View My Ticket</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create New Ticket</h1>
        <p className="text-slate-500">Submit a complaint, suggestion, or request support.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Subject *</label>
            <input 
              {...form.register("subject")} 
              className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" 
              placeholder="Brief description of the issue"
            />
            {form.formState.errors.subject && <p className="text-red-500 text-xs">{form.formState.errors.subject.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category *</label>
              <select 
                {...form.register("category")}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
              >
                <option value="">Select Category</option>
                <option value="Membership Issue">Membership Issue</option>
                <option value="Payment Issue">Payment Issue</option>
                <option value="Technical Problem">Technical Problem</option>
                <option value="Suggestion">Suggestion</option>
                <option value="Feedback">Feedback</option>
                <option value="Other">Other</option>
              </select>
              {form.formState.errors.category && <p className="text-red-500 text-xs">{form.formState.errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Priority</label>
              <select 
                {...form.register("priority")}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Detailed Description *</label>
            <textarea 
              {...form.register("description")} 
              className="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all resize-none" 
              placeholder="Please provide as much detail as possible..."
            />
            {form.formState.errors.description && <p className="text-red-500 text-xs">{form.formState.errors.description.message}</p>}
          </div>

          {/* File Upload Area */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Attachment (Optional)</label>
            {!file ? (
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative cursor-pointer group">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  onChange={(e) => {
                    const selected = e.target.files?.[0];
                    if (selected && selected.size <= 10 * 1024 * 1024) setFile(selected);
                    else if (selected) alert("File exceeds 10MB limit.");
                  }}
                />
                <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3 group-hover:text-primary transition-colors" />
                <p className="font-semibold text-slate-900 dark:text-white mb-1">Click or drag file to upload</p>
                <p className="text-sm text-slate-500">PDF, JPG, PNG, DOC up to 10MB</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                    <FileIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setFile(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
            <Link href="/dashboard/support">
              <Button type="button" variant="ghost" className="h-12 px-8 rounded-full font-bold">Cancel</Button>
            </Link>
            <Button 
              type="submit" 
              disabled={isUploading}
              className="h-12 px-8 rounded-full font-bold bg-primary text-slate-950 hover:bg-primary/90 shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isUploading ? "Uploading & Submitting..." : "Submit Ticket"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
