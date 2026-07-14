"use client";

import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, LifeBuoy, AlertCircle, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

export default function SupportDashboard() {
  const MOCK_TICKETS = [
    { id: "TKT-2026-000001", subject: "Payment Verification Pending", category: "Payment Issue", status: "In Progress", priority: "High", date: "Oct 12, 2024" },
    { id: "TKT-2026-000002", subject: "Membership Upgrade Issue", category: "Membership Issue", status: "Open", priority: "Medium", date: "Oct 10, 2024" },
    { id: "TKT-2026-000003", subject: "Website Feedback", category: "Suggestion", status: "Resolved", priority: "Low", date: "Oct 05, 2024" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open": return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
      case "In Progress": return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";
      case "Resolved": return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-600 dark:text-red-400 border-red-200 dark:border-red-900";
      case "Medium": return "text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900";
      case "Low": return "text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900";
      default: return "text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Complaint & Suggestions</h1>
          <p className="text-slate-500">Raise issues, track your tickets, or provide feedback.</p>
        </div>
        <Link href="/dashboard/support/new">
          <Button className="h-12 px-6 rounded-full font-bold bg-primary text-slate-950 hover:bg-primary/90 shadow-lg shadow-primary/20">
            <PlusCircle className="w-5 h-5 mr-2" /> New Ticket
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Total Tickets" value="3" icon={LifeBuoy} className="p-4" />
        <StatsCard title="Open" value="1" icon={AlertCircle} className="p-4" />
        <StatsCard title="In Progress" value="1" icon={Clock} className="p-4" />
        <StatsCard title="Resolved" value="1" icon={CheckCircle2} className="p-4" />
      </div>

      {/* Ticket List Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by ID or Subject..." 
              className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <select className="h-11 px-4 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary text-sm font-medium">
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
            <select className="h-11 px-4 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary text-sm font-medium">
              <option value="">All Categories</option>
              <option value="Payment">Payment</option>
              <option value="Membership">Membership</option>
              <option value="Suggestion">Suggestion</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm">
                <th className="p-4 font-semibold whitespace-nowrap">Ticket ID</th>
                <th className="p-4 font-semibold">Subject</th>
                <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                <th className="p-4 font-semibold whitespace-nowrap">Priority</th>
                <th className="p-4 font-semibold whitespace-nowrap">Date</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {MOCK_TICKETS.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="p-4 font-mono font-medium text-slate-900 dark:text-white whitespace-nowrap">{ticket.id}</td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900 dark:text-white mb-1">{ticket.subject}</div>
                    <div className="text-sm text-slate-500 flex items-center gap-2">
                      <MessageSquare className="w-3 h-3" /> {ticket.category}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityBadge(ticket.priority)} bg-transparent`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-sm whitespace-nowrap">{ticket.date}</td>
                  <td className="p-4 text-right">
                    <Link href={`/dashboard/support/${ticket.id}`}>
                      <Button variant="ghost" className="text-primary font-semibold hover:bg-primary/10">View Ticket</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
