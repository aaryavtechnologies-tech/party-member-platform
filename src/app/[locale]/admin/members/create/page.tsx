"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMemberByAdmin } from "@/actions/admin/members";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Save, UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function AddMemberPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    fatherName: "",
    gender: "MALE",
    dob: "",
    state: "",
    district: "",
    taluka: "",
    village: "",
    fullAddress: "",
    pincode: "",
    membershipType: "PRIMARY",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createMemberByAdmin(formData);
      toast.success("Member created successfully!");
      router.push("/admin/members");
    } catch (error: any) {
      toast.error(error.message || "Failed to create member");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />
      
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Add New Member</h1>
        <p className="text-slate-500">Create a new member and set their initial password.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Account Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" /> Account Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Full Name *</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Email *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Mobile *</label>
                <input required name="mobile" value={formData.mobile} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Login Password *</label>
                <input required type="text" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Set initial password" />
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Father's Name</label>
                <input name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Gender *</label>
                <select required name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Date of Birth *</label>
                <input required type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold">Location & Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">State *</label>
                <input required name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">District *</label>
                <input required name="district" value={formData.district} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Taluka *</label>
                <input required name="taluka" value={formData.taluka} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Village / Ward *</label>
                <input required name="village" value={formData.village} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold">Full Address</label>
                <textarea rows={2} name="fullAddress" value={formData.fullAddress} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Pincode *</label>
                <input required name="pincode" value={formData.pincode} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </div>

        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-primary text-slate-950 font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50">
            <Save className="w-4 h-4" /> {isSubmitting ? "Saving..." : "Create Member"}
          </button>
        </div>
      </form>
    </div>
  );
}
