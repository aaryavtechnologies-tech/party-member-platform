"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Calendar, Camera } from "lucide-react";

const profileSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  fatherName: z.string().min(3, "Father/Husband name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  email: z.string().email(),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  address: z.string().min(5, "Address is required"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid PIN code"),
});

type ProfileData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const form = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "Himanshu",
      fatherName: "Ramesh Kumar",
      dob: "1990-01-01",
      email: "himanshu@example.com",
      mobile: "9876543210",
      address: "123 Main Street, City",
      pincode: "110001"
    }
  });

  const onSubmit = (data: ProfileData) => {
    console.log("Updating profile", data);
    // TODO: Connect to backend
    alert("Profile updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p className="text-slate-500">Manage your personal information and contact details.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 pb-10 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-950 shadow-lg flex items-center justify-center overflow-hidden">
              <User className="w-12 h-12 text-slate-400" />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-slate-950 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile Photo</h2>
            <p className="text-sm text-slate-500 mb-3">JPG, GIF or PNG. Max size of 5MB.</p>
            <Button variant="outline" size="sm" className="rounded-full">Upload New Photo</Button>
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
                <input {...form.register("email")} type="email" className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all" />
              </div>
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
          </div>

          <div className="pt-6 flex justify-end">
            <Button type="submit" className="h-12 px-8 rounded-full font-bold bg-primary text-slate-950 hover:bg-primary/90 shadow-lg shadow-primary/20">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
