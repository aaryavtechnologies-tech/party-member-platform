import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { User, Calendar, Tag, AlertCircle, MessageSquare, Paperclip, Send, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/routing";

export default async function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const ticket = await prisma.supportTicket.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          memberProfile: true
        }
      },
      messages: {
        orderBy: { createdAt: 'asc' }
      },
      attachments: true
    }
  });

  if (!ticket) {
    notFound();
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "OPEN": return "bg-blue-100 text-blue-700 border-blue-200";
      case "IN_PROGRESS": return "bg-orange-100 text-orange-700 border-orange-200";
      case "RESOLVED": return "bg-green-100 text-green-700 border-green-200";
      case "CLOSED": return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{ticket.subject}</h1>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(ticket.status)}`}>
              {ticket.status.replace("_", " ")}
            </span>
          </div>
          <p className="text-slate-500 font-mono text-sm">Ticket ID: {ticket.ticketNumber}</p>
        </div>
        <div className="flex gap-2">
          {ticket.status !== "RESOLVED" && ticket.status !== "CLOSED" && (
            <button className="px-4 py-2 bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg text-sm font-bold hover:bg-green-100 transition-colors flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Mark Resolved
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Main Conversation Thread */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Initial Request */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{ticket.user.name}</p>
                <p className="text-xs text-slate-500">{new Date(ticket.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
              {ticket.description}
            </div>
            
            {ticket.attachments.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                {ticket.attachments.map(att => (
                  <Link key={att.id} href={att.fileUrl} target="_blank">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors">
                      <Paperclip className="w-3.5 h-3.5" /> {att.fileName}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Replies */}
          <div className="space-y-4">
            {ticket.messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.senderType === "ADMIN" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 ${
                  msg.senderType === "ADMIN" 
                    ? "bg-primary/10 border border-primary/20 text-slate-900 dark:text-slate-100" 
                    : "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-xs">{msg.senderType === "ADMIN" ? "Support Team" : ticket.user.name}</span>
                    <span className="text-[10px] text-slate-500">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Box */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <textarea 
              rows={4}
              placeholder="Type your reply to the member here..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary transition-all resize-none mb-3"
            ></textarea>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>
              <button className="px-6 py-2 bg-primary text-slate-950 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
                <Send className="w-4 h-4" /> Send Reply
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Ticket Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Category</p>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{ticket.category}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Priority</p>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{ticket.priority}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Created</p>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Member Info</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <User className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{ticket.user.name}</p>
                <p className="text-xs text-slate-500">{ticket.user.email}</p>
              </div>
            </div>
            {ticket.user.memberProfile ? (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 mb-1">RAVP ID</p>
                <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">{ticket.user.memberProfile.memberId}</p>
                <Link href={`/admin/members/${ticket.user.memberProfile.id}`}>
                  <button className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors">
                    View Full Profile
                  </button>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
                This user is not a registered party member.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
