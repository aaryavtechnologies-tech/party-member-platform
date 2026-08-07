"use client";

import React from "react";
import { Plus, Users, Lock, Unlock, Trash2, ShieldAlert, ArrowRight } from "lucide-react";
import { deleteCommunity } from "@/actions/communities/create";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "@/styles/designTokens.css";

interface Community {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  isPublic: boolean;
  createdAt: Date;
  _count: { members: number; posts: number };
}

export default function CommunitiesClient({ initialData }: { initialData: Community[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this community? This action is irreversible.")) return;

    try {
      const res = await deleteCommunity(id);
      if (res.success) {
        toast.success("Community deleted");
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            Manage Communities
          </h2>
          <p className="text-slate-500 mt-1">Oversee groups, handle join requests, and moderate discussions.</p>
        </div>
        <Link
          href="/admin/communities/new"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-orange-500 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(255,153,51,0.4)] transition-all duration-300 hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" /> Create New Community
        </Link>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {initialData.map((community) => (
          <div key={community.id} className="group bg-white dark:bg-slate-900 rounded-3xl p-1 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col relative overflow-hidden">
            {/* Inner Padding */}
            <div className="p-6 h-full flex flex-col relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  {community.logoUrl ? (
                    <img src={community.logoUrl} alt={community.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="bg-gradient-to-br from-primary/20 to-orange-500/20 w-full h-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleDelete(community.id)}
                      className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                      title="Delete Community"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                {community.isPublic ? (
                  <span className="px-2.5 py-1 bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 rounded-lg text-xs font-bold flex items-center gap-1 border border-green-200/50 dark:border-green-500/20">
                    <Unlock className="w-3 h-3" /> Public
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400 rounded-lg text-xs font-bold flex items-center gap-1 border border-yellow-200/50 dark:border-yellow-500/20">
                    <Lock className="w-3 h-3" /> Private
                  </span>
                )}
              </div>

              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-2 line-clamp-1">{community.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 flex-grow leading-relaxed">
                {community.description || "No description provided."}
              </p>

              <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{community._count.members}</div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Members</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{community._count.posts}</div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Posts</div>
                </div>
              </div>

              <Link 
                href={`/admin/communities/${community.id}`}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-primary hover:text-white transition-colors group/btn"
              >
                Manage <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
        {initialData.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Communities Found</h3>
            <p className="text-slate-500 mb-6 max-w-md text-center">You haven't created any communities yet. Communities allow members to interact, post, and chat securely.</p>
            <Link
              href="/admin/communities/new"
              className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover-lift transition"
            >
              Create the first one
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
