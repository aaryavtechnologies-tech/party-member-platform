"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Calendar, Camera, Loader2, CreditCard, Briefcase, Hash, ShieldCheck, Ticket, CalendarDays, Flag, Building2, Landmark, Tent } from "lucide-react";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { updateProfile } from "./actions";
import Image from "next/image";

const profileSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  fatherName: z.string().min(3, "Father/Husband name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  email: z.string().email(),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  address: z.string().min(5, "Address is required"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid PIN code"),
  voterId: z.string().optional(),
  aadhaar: z.string().optional(),
  image: z.string().optional(),
  gender: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  taluka: z.string().optional(),
  village: z.string().optional(),
  occupation: z.string().optional(),
  
  // read-only fields
  memberId: z.string().optional(),
  membershipType: z.string().optional(),
  status: z.string().optional(),
  referralCode: z.string().optional(),
  issueDate: z.string().optional(),
});

export type ProfileData = z.infer<typeof profileSchema>;

export function ProfileFormClient({ defaultValues }: { defaultValues: ProfileData }) {
  const form = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      form.setValue("image", data.url);
      toast.success("Photo uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ProfileData) => {
    try {
      setIsSubmitting(true);
      const res = await updateProfile(data);
      if (res.success) {
        toast.success("Profile saved successfully!");
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while saving profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentImage = form.watch("image");

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 pb-10 border-b border-slate-100 dark:border-slate-800">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-950 shadow-lg flex items-center justify-center overflow-hidden">
            {currentImage ? (
              <Image src={currentImage} alt="Profile" width={96} height={96} className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-slate-400" />
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-slate-950 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/jpeg, image/png, image/gif"
            onChange={handleImageUpload}
          />
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile Photo</h2>
          <p className="text-sm text-slate-500 mb-3">JPG, GIF or PNG. Max size of 5MB.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload New Photo"}
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input {...form.register("fullName")} className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Father/Husband Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input {...form.register("fatherName")} className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input {...form.register("email")} type="email" disabled className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 outline-none cursor-not-allowed opacity-70" />
            </div>
            <p className="text-xs text-slate-500">Email cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input {...form.register("mobile")} className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input {...form.register("address")} className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Voter ID (Optional)</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input {...form.register("voterId")} className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all uppercase" placeholder="e.g. ABC1234567" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Aadhaar Number (Optional)</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input {...form.register("aadhaar")} className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all tracking-widest" placeholder="e.g. 1234 5678 9012" maxLength={14} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gender</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select {...form.register("gender")} className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all appearance-none">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Occupation</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input {...form.register("occupation")} className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Your occupation" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">State</label>
            <div className="relative">
              <Flag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input {...form.register("state")} className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">District</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input {...form.register("district")} className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Taluka</label>
            <div className="relative">
              <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input {...form.register("taluka")} className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Village/City</label>
            <div className="relative">
              <Tent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input {...form.register("village")} className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Membership Details</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Member ID</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input {...form.register("memberId")} disabled className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 outline-none cursor-not-allowed opacity-70 font-mono" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Membership Type</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input {...form.register("membershipType")} disabled className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 outline-none cursor-not-allowed opacity-70" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Status</label>
              <div className="relative">
                <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input {...form.register("status")} disabled className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 outline-none cursor-not-allowed opacity-70" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Referral Code</label>
              <div className="relative">
                <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input {...form.register("referralCode")} disabled className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 outline-none cursor-not-allowed opacity-70 font-mono" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Join Date</label>
              <div className="relative">
                <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input {...form.register("issueDate")} disabled className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 outline-none cursor-not-allowed opacity-70" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="h-12 px-8 rounded-full font-bold bg-primary text-slate-950 hover:bg-primary/90 shadow-lg shadow-primary/20">
            {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
