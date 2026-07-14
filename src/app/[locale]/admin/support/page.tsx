import { prisma } from "@/lib/prisma";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";
import { MessageSquare, AlertCircle, CheckCircle, Clock, Search, Filter, Eye } from "lucide-react";
import { Link } from "@/i18n/routing";

export default async function SupportDashboardPage() {
  const [totalOpen, totalInProgress, totalResolved, totalClosed] = await Promise.all([
    prisma.supportTicket.count({ where: { status: "OPEN" } }),
    prisma.supportTicket.count({ where: { status: "IN_PROGRESS" } }),
    prisma.supportTicket.count({ where: { status: "RESOLVED" } }),
    prisma.supportTicket.count({ where: { status: "CLOSED" } })
  ]);

  const tickets = await prisma.supportTicket.findMany({
    include: {
      user: true
    },
    orderBy: { createdAt: 'desc' }
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "OPEN": return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200";
      case "IN_PROGRESS": return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200";
      case "RESOLVED": return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200";
      case "CLOSED": return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case "URGENT": return "text-red-600 bg-red-100 dark:bg-red-500/10 border-red-200";
      case "HIGH": return "text-orange-600 bg-orange-100 dark:bg-orange-500/10 border-orange-200";
      case "MEDIUM": return "text-blue-600 bg-blue-100 dark:bg-blue-500/10 border-blue-200";
      default: return "text-slate-600 bg-slate-100 dark:bg-slate-800 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Support Tickets</h1>
          <p className="text-slate-500">Manage member complaints, suggestions, and support requests.</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <AdminStatsCard title="Open Tickets" value={totalOpen} icon={AlertCircle} className="p-4 sm:p-6" />
        <AdminStatsCard title="In Progress" value={totalInProgress} icon={Clock} className="p-4 sm:p-6" />
        <AdminStatsCard title="Resolved" value={totalResolved} icon={CheckCircle} className="p-4 sm:p-6" />
        <AdminStatsCard title="Closed" value={totalClosed} icon={MessageSquare} className="p-4 sm:p-6" />
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tickets by ID, subject, or member..." 
              className="w-full h-10 pl-9 pr-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <button className="h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900 whitespace-nowrap">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4">Ticket</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Member</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    <MessageSquare className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                    No support tickets found in the system.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
                    <td className="p-4">
                      <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">{ticket.ticketNumber}</p>
                      <p className="text-xs text-slate-500">{ticket.category}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-900 dark:text-white text-sm max-w-[250px] truncate" title={ticket.subject}>
                        {ticket.subject}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-900 dark:text-white text-sm">{ticket.user.name}</p>
                      <p className="text-xs text-slate-500 font-mono truncate max-w-[150px]">{ticket.user.email}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(ticket.status)}`}>
                        {ticket.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                      <p>{new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/support/${ticket.id}`}>
                          <button className="px-3 py-1.5 rounded-lg bg-primary text-slate-950 font-bold text-xs hover:bg-primary/90 transition-colors flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
