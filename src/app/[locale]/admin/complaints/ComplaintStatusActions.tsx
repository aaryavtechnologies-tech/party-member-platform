"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateComplaintStatus } from "@/actions/admin/complaints";
import { CheckCircle, AlertTriangle, UserCheck, XCircle } from "lucide-react";

export default function ComplaintStatusActions({ ticketId, currentStatus }: { ticketId: string, currentStatus: string }) {
  
  const handleUpdate = async (status: string) => {
    try {
      await updateComplaintStatus(ticketId, status);
      toast.success(`Complaint status updated to ${status}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update complaint status");
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
      {currentStatus === "OPEN" && (
        <Button onClick={() => handleUpdate("ASSIGNED")} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          <UserCheck className="w-4 h-4 mr-2" /> Assign to Me
        </Button>
      )}

      {(currentStatus === "ASSIGNED" || currentStatus === "OPEN") && (
        <Button onClick={() => handleUpdate("IN_PROGRESS")} size="sm" variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
          <AlertTriangle className="w-4 h-4 mr-2" /> Mark In Progress
        </Button>
      )}

      {currentStatus === "IN_PROGRESS" && (
        <Button onClick={() => handleUpdate("RESOLVED")} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
          <CheckCircle className="w-4 h-4 mr-2" /> Resolve
        </Button>
      )}

      {currentStatus === "RESOLVED" && (
        <Button onClick={() => handleUpdate("CLOSED")} size="sm" variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50">
          <XCircle className="w-4 h-4 mr-2" /> Close Ticket
        </Button>
      )}
    </div>
  );
}
