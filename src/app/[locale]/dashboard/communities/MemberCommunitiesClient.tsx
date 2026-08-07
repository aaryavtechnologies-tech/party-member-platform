"use client";

import React, { useState } from "react";
import { Users, Lock, Unlock, LogIn, Clock } from "lucide-react";
import { joinCommunity } from "@/actions/communities/join";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import "@/styles/designTokens.css";
import Link from "next/link";

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
  const router = useRouter();

  async function handleJoin(communityId: string) {
    setIsJoining(communityId);
    try {
      const res = await joinCommunity(communityId);
      if (res.success) {
        toast.success("Request sent / Joined successfully");
        router.refresh(); // Rely on Next.js refresh to get updated data
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to join community");
    } finally {
      setIsJoining(null);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {communities.map((community) => {
        const isMember = community.members.length > 0;
        const pendingRequest = community.joinRequests.length > 0 && community.joinRequests[0].status === "PENDING";

        return (
          <div key={community.id} className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-glass border border-slate-200 dark:border-slate-800 hover-lift transition flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl overflow-hidden shrink-0">
                {community.logoUrl ? (
                  <img src={community.logoUrl} alt={community.name} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                {community.isPublic ? (
                  <span className="p-1.5 bg-green-100 text-green-700 rounded-md inline-block" title="Public">
                    <Unlock className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="p-1.5 bg-yellow-100 text-yellow-700 rounded-md inline-block" title="Private">
                    <Lock className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>

            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 line-clamp-1">
              {community.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 flex-grow">
              {community.description || "No description provided."}
            </p>

            <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 mb-4">
              <Users className="w-4 h-4" /> {community._count.members} members
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
              {isMember ? (
                <Link 
                  href={`/dashboard/communities/${community.id}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition"
                >
                  Enter Community
                </Link>
              ) : pendingRequest ? (
                <button 
                  disabled
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-500 font-medium rounded-lg"
                >
                  <Clock className="w-4 h-4" /> Request Pending
                </button>
              ) : (
                <button 
                  onClick={() => handleJoin(community.id)}
                  disabled={isJoining === community.id}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-lg hover-lift transition disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" /> {community.isPublic ? "Join Now" : "Request to Join"}
                </button>
              )}
            </div>
          </div>
        );
      })}

      {communities.length === 0 && (
        <div className="col-span-full py-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-xl shadow-glass border border-slate-200 dark:border-slate-800">
          No communities available right now.
        </div>
      )}
    </div>
  );
}
