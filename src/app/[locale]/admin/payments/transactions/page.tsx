import { prisma } from "@/lib/prisma";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Search, Filter, MoreHorizontal, Download, Eye, FileText } from "lucide-react";
import { Link } from "@/i18n/routing";

export default async function AdminTransactionsPage() {
  const transactions = await prisma.payment.findMany({
    include: {
      user: {
        include: {
          memberProfile: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "SUCCESS": return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200";
      case "PENDING": case "PROCESSING": return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200";
      case "FAILED": return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Transactions</h1>
          <p className="text-slate-500">View and manage all platform payments and membership upgrades.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Payment ID, Order ID, or Member..." 
              className="w-full h-10 pl-9 pr-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <button className="h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900 whitespace-nowrap">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <select className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-medium outline-none">
              <option>All Statuses</option>
              <option>Success</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="p-4 w-12 text-center">
                  <input type="checkbox" className="rounded border-slate-300" />
                </th>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Member Info</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Purpose</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-500">
                    No transactions found in the database.
                  </td>
                </tr>
              ) : (
                transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
                    <td className="p-4 text-center">
                      <input type="checkbox" className="rounded border-slate-300" />
                    </td>
                    <td className="p-4">
                      <p className="font-mono text-sm text-slate-900 dark:text-white">{txn.id.split("-")[0].toUpperCase()}</p>
                      <p className="font-mono text-xs text-slate-500 truncate max-w-[120px]" title={txn.razorpayOrderId}>{txn.razorpayOrderId}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{txn.user.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{txn.user.memberProfile?.memberId || "Pending ID"}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {txn.currency === "INR" ? "₹" : txn.currency} {(txn.amount / 100).toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-500">{txn.paymentMethod || "Razorpay"}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-primary/20 text-primary bg-primary/5 uppercase tracking-wider">
                        {txn.upgradeTo.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(txn.status)}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                      <p>{new Date(txn.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs">{new Date(txn.createdAt).toLocaleTimeString()}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors" title="View Receipt">
                          <FileText className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors" title="More Actions">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 text-sm">
          <p className="text-slate-500">Showing {transactions.length} entries</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-400 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 rounded bg-primary text-slate-950 font-bold">1</button>
            <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}
