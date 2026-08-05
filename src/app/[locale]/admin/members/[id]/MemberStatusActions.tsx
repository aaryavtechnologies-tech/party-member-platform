"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateMemberStatus } from "@/actions/admin/members";
import { CheckCircle, XCircle, Ban, RefreshCw } from "lucide-react";
import { MemberStatus } from "@prisma/client";

export default function MemberStatusActions({ memberId, currentStatus }: { memberId: string, currentStatus: MemberStatus }) {
  
  const handleUpdate = async (status: MemberStatus) => {
    try {
      await updateMemberStatus(memberId, status);
      toast.success(`Member status updated to ${status}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update member status");
    }
  };

  return (
    <>
      {currentStatus === "PENDING_VERIFICATION" && (
        <Button onClick={() => handleUpdate("ACTIVE")} className="bg-green-600 hover:bg-green-700 text-white shadow-sm">
          <CheckCircle className="w-4 h-4 mr-2" /> Approve Member
        </Button>
      )}

      {currentStatus === "PENDING_VERIFICATION" && (
        <Button onClick={() => handleUpdate("REJECTED")} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
          <XCircle className="w-4 h-4 mr-2" /> Reject
        </Button>
      )}

      {currentStatus === "ACTIVE" && (
        <Button onClick={() => handleUpdate("SUSPENDED")} variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
          <Ban className="w-4 h-4 mr-2" /> Suspend
        </Button>
      )}

      {(currentStatus === "SUSPENDED" || currentStatus === "REJECTED") && (
        <Button onClick={() => handleUpdate("ACTIVE")} variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
          <RefreshCw className="w-4 h-4 mr-2" /> Reactivate
        </Button>
      )}
    </>
  );
}
