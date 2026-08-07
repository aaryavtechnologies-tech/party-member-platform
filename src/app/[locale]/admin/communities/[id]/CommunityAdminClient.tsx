"use client";

import React, { useState } from "react";
import { Check, X, Users, Clock } from "lucide-react";
import { processJoinRequest } from "@/actions/communities/join";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import "@/styles/designTokens.css";

export default function CommunityAdminClient({ 
  community, 
  initialRequests 
}: { 
  community: any; 
  initialRequests: any[]; 
}) {
  const [requests, setRequests] = useState(initialRequests);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const router = useRouter();

  async function handleProcess(id: string, action: "APPROVE" | "REJECT") {
    setProcessingId(id);
    try {
      const res = await processJoinRequest(id, action);
      if (res.success) {
        toast.success(`Request ${action.toLowerCase()}d successfully`);
        setRequests(prev => prev.filter(r => r.id !== id));
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Action failed");
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-glass border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl overflow-hidden shrink-0">
            {community.logoUrl ? (
              <img src={community.logoUrl} alt={community.name} className="w-full h-full object-cover" />
            ) : (
              <Users className="w-8 h-8 text-primary" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{community.name}</h2>
            <div className="text-slate-500">
              {community.isPublic ? "Public Community" : "Private Community"} • {community._count.members} Members
            </div>
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-300">
          {community.description || "No description."}
        </p>
      </div>

      {/* Join Requests */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-glass border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">Pending Join Requests</h3>
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold ml-2">
            {requests.length}
          </span>
        </div>

        {community.isPublic ? (
          <div className="text-center py-8 text-slate-500">
            This is a public community. Members can join instantly without approval.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <div key={req.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                    <img src={req.memberProfile.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.memberProfile.user.name)}`} alt="" />
                  </div>
                  <div>
                    <div className="font-bold">{req.memberProfile.user.name}</div>
                    <div className="text-sm text-slate-500">ID: {req.memberProfile.memberId}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleProcess(req.id, "REJECT")}
                    disabled={processingId === req.id}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                    title="Reject"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleProcess(req.id, "APPROVE")}
                    disabled={processingId === req.id}
                    className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition disabled:opacity-50"
                    title="Approve"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            {requests.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No pending requests at this time.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
