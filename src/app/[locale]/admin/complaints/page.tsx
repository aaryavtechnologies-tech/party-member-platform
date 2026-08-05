import { getAdminComplaints } from "@/actions/admin/complaints";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { MessageSquare, AlertCircle, Clock, CheckCircle } from "lucide-react";
import ComplaintStatusActions from "./ComplaintStatusActions";

export const dynamic = 'force-dynamic';

export default async function AdminComplaintsPage() {
  const complaints = await getAdminComplaints();

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "OPEN": return "bg-red-100 text-red-700";
      case "ASSIGNED": return "bg-blue-100 text-blue-700";
      case "IN_PROGRESS": return "bg-orange-100 text-orange-700";
      case "RESOLVED": return "bg-green-100 text-green-700";
      case "CLOSED": return "bg-slate-100 text-slate-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case "HIGH":
      case "URGENT": return "text-red-600 bg-red-50 border-red-200";
      case "MEDIUM": return "text-orange-600 bg-orange-50 border-orange-200";
      default: return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <AdminBreadcrumbs />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> Grievance & Complaints
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {complaints.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">
              No complaints found in your jurisdiction.
            </div>
          ) : (
            complaints.map((ticket: any) => (
              <div key={ticket.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:shadow-md transition-all bg-white dark:bg-slate-950 flex flex-col justify-between">
                
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                      {ticket.ticketNumber}
                    </span>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(ticket.status)}`}>
                      {ticket.status.replace("_", " ")}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{ticket.subject}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
                    {ticket.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${getPriorityBadge(ticket.priority)}`}>
                      {ticket.priority} PRIORITY
                    </span>
                    <span className="text-[10px] font-bold px-2 py-1 rounded border border-slate-200 text-slate-600 bg-slate-50 uppercase">
                      {ticket.category}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-500">
                    <p>Submitted by: <span className="font-semibold text-slate-700 dark:text-slate-300">{ticket.user?.name || "Unknown User"}</span></p>
                    <p>Location: <span className="font-semibold text-slate-700 dark:text-slate-300">{ticket.village || ticket.taluka || ticket.district || ticket.state || "N/A"}</span></p>
                    <p>Created: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <ComplaintStatusActions ticketId={ticket.id} currentStatus={ticket.status} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
