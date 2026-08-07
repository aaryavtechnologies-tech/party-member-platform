"use client";

import React, { useState } from "react";
import { Users, Lock, Unlock, LogIn, Clock, ArrowRight, Sparkles, Compass, CheckCircle2 } from "lucide-react";
import { joinCommunity } from "@/actions/communities/join";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import "@/styles/designTokens.css";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type CommunityData = {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  isPublic: boolean;
  _count: { members: number };
  members: { role: string }[];
  joinRequests: { status: string }[];
};

export default function MemberCommunitiesClient({ 
  initialCommunities,
  memberProfileId 
}: { 
  initialCommunities: CommunityData[],
  memberProfileId: string
}) {
  const [communities, setCommunities] = useState<CommunityData[]>(initialCommunities);
  const [isJoining, setIsJoining] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"joined" | "discover">("joined");
  const router = useRouter();

  async function handleJoin(communityId: string) {
    setIsJoining(communityId);
    try {
      const res = await joinCommunity(communityId);
      if (res.success) {
        toast.success("Request sent / Joined successfully");
        setCommunities(prev => prev.map(c => {
          if (c.id === communityId) {
            if (c.isPublic) {
              return { ...c, members: [{ role: "MEMBER" }] };
            } else {
              return { ...c, joinRequests: [{ status: "PENDING" }] };
            }
          }
          return c;
        }));
        router.refresh(); 
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to join community");
    } finally {
      setIsJoining(null);
    }
  }

  const joinedCommunities = communities.filter(c => c.members.length > 0);
  const discoverCommunities = communities.filter(c => c.members.length === 0);

  const displayedCommunities = activeTab === "joined" ? joinedCommunities : discoverCommunities;

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md p-1.5 rounded-full flex gap-2 border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
          <button 
            onClick={() => setActiveTab("joined")}
            className={`relative px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 z-10 ${
              activeTab === "joined" ? "text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {activeTab === "joined" && (
              <motion.div layoutId="activeTab" className="absolute inset-0 bg-primary rounded-full -z-10 shadow-md" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
            )}
            <CheckCircle2 className="w-4 h-4" /> My Communities
          </button>
          
          <button 
            onClick={() => setActiveTab("discover")}
            className={`relative px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 z-10 ${
              activeTab === "discover" ? "text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {activeTab === "discover" && (
              <motion.div layoutId="activeTab" className="absolute inset-0 bg-primary rounded-full -z-10 shadow-md" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
            )}
            <Compass className="w-4 h-4" /> Discover New
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {displayedCommunities.map((community) => {
            const isMember = community.members.length > 0;
            const pendingRequest = community.joinRequests.length > 0 && community.joinRequests[0].status === "PENDING";

            return (
              <div 
                key={community.id} 
                className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-slate-800/60 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col relative overflow-hidden"
              >
                {/* Background Glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform duration-300">
                    {community.logoUrl ? (
                      <img src={community.logoUrl} alt={community.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div>
                    {community.isPublic ? (
                      <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                        <Unlock className="w-3.5 h-3.5" /> Public
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold flex items-center gap-1.5 border border-amber-100 dark:border-amber-500/20 shadow-sm">
                        <Lock className="w-3.5 h-3.5" /> Private
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative z-10 flex-grow">
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {community.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 leading-relaxed">
                    {community.description || "Join this community to connect with other members and stay updated."}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100 dark:border-slate-800/80 relative z-10">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                    <Users className="w-4 h-4 text-primary" /> 
                    {community._count.members}
                  </div>

                  <div className="flex-1 ml-4">
                    {isMember ? (
                      <Link 
                        href={`/dashboard/communities/${community.id}`}
                        className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 group/btn"
                      >
                        Enter <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    ) : pendingRequest ? (
                      <button 
                        disabled
                        className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner cursor-not-allowed"
                      >
                        <Clock className="w-4 h-4 animate-pulse" /> Sent
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleJoin(community.id)}
                        disabled={isJoining === community.id}
                        className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 group/btn"
                      >
                        {isJoining === community.id ? (
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        ) : (
                          <>
                            {community.isPublic ? <Sparkles className="w-4 h-4 text-amber-300" /> : <LogIn className="w-4 h-4" />}
                            {community.isPublic ? "Join Now" : "Request"}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {displayedCommunities.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-sm">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Compass className="w-10 h-10 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                No Communities Found
              </h3>
              <p className="text-slate-500 max-w-md">
                {activeTab === "joined" 
                  ? "You haven't joined any communities yet. Click on the 'Discover New' tab to explore available communities." 
                  : "There are no new communities available to join right now."}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
