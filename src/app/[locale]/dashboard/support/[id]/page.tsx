"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { 
  ArrowLeft, Paperclip, Send, AlertCircle, 
  Clock, CheckCircle2, User, UserCheck, FileText 
} from "lucide-react";

const MOCK_TICKET = {
  id: "TKT-2026-000001",
  subject: "Payment Verification Pending",
  category: "Payment Issue",
  status: "In Progress",
  priority: "High",
  createdAt: "Oct 12, 2024, 10:45 AM",
  description: "I upgraded to Lifetime Primary via Razorpay, the amount was deducted from my bank but my dashboard still says Primary Member.",
  attachments: [{ name: "bank_receipt.pdf", size: "1.2 MB", url: "#" }]
};

const MOCK_MESSAGES = [
  { id: 1, sender: "Admin", time: "Oct 12, 2024, 11:30 AM", content: "Dear Himanshu, we apologize for the inconvenience. Could you please provide your Razorpay transaction ID?" },
  { id: 2, sender: "Me", time: "Oct 12, 2024, 12:15 PM", content: "Sure, the transaction ID is pay_P4L8Y2NqG9." }
];

export default function TicketDetailsPage({ params }: { params: { id: string } }) {
  const [reply, setReply] = useState("");
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open": return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
      case "In Progress": return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";
      case "Resolved": return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/support">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            Ticket {params.id}
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusBadge(MOCK_TICKET.status)}`}>
              {MOCK_TICKET.status}
            </span>
          </h1>
          <p className="text-sm text-slate-500">Opened on {MOCK_TICKET.createdAt}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Conversation Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Original Post */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">You (Member)</h3>
                <p className="text-sm text-slate-500">{MOCK_TICKET.createdAt}</p>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{MOCK_TICKET.subject}</h2>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap mb-6 leading-relaxed">
              {MOCK_TICKET.description}
            </p>
            
            {/* Attachments */}
            {MOCK_TICKET.attachments.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Paperclip className="w-4 h-4" /> Attachments
                </p>
                <div className="flex gap-4 flex-wrap">
                  {MOCK_TICKET.attachments.map((att, i) => (
                    <a key={i} href={att.url} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{att.name}</p>
                        <p className="text-xs text-slate-500">{att.size}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Conversation Thread */}
          <div className="space-y-6">
            {MOCK_MESSAGES.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.sender === "Me" ? "flex-row-reverse" : ""}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "Me" ? "bg-primary text-slate-950" : "bg-slate-800 text-white"}`}>
                  {msg.sender === "Me" ? <User className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                </div>
                <div className={`flex flex-col ${msg.sender === "Me" ? "items-end" : "items-start"} max-w-[80%]`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{msg.sender === "Me" ? "You" : "Support Team"}</span>
                    <span className="text-xs text-slate-500">{msg.time}</span>
                  </div>
                  <div className={`p-4 rounded-2xl ${msg.sender === "Me" ? "bg-primary/10 text-slate-900 dark:text-white rounded-tr-none" : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm rounded-tl-none"}`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm">
            <textarea 
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply here..."
              className="w-full h-32 p-4 bg-transparent outline-none resize-none text-sm"
            />
            <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button className="rounded-full px-6 bg-primary text-slate-950 font-bold shadow-lg shadow-primary/20">
                Send Reply <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Ticket Details</h3>
            
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-slate-500 mb-1">Category</p>
                <p className="font-semibold text-slate-900 dark:text-white">{MOCK_TICKET.category}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Priority</p>
                <div className="flex items-center gap-2">
                  <AlertCircle className={`w-4 h-4 ${MOCK_TICKET.priority === 'High' ? 'text-red-500' : 'text-slate-500'}`} />
                  <span className="font-semibold text-slate-900 dark:text-white">{MOCK_TICKET.priority}</span>
                </div>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Last Updated</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-900 dark:text-white">Oct 12, 2024, 12:15 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Issue Resolved?</h3>
            <p className="text-sm text-slate-500 mb-4">If your problem has been fixed, you can close this ticket.</p>
            <Button variant="outline" className="w-full rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
              Close Ticket
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
