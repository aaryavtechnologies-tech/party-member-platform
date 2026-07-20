import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CreditCard, Download, CheckCircle2, XCircle, Clock } from "lucide-react";

export default async function PaymentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/membership/login");
  }

  const payments = await prisma.payment.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Payment History</h1>
        <p className="text-slate-500">View and download your past transaction receipts.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {payments.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <CreditCard className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No payments yet</h3>
            <p className="text-slate-500">You haven't made any transactions yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300 text-sm">Transaction ID</th>
                  <th className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300 text-sm">Date</th>
                  <th className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300 text-sm">Amount</th>
                  <th className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300 text-sm">Purpose</th>
                  <th className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300 text-sm">Status</th>
                  <th className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300 text-sm text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm text-slate-600 dark:text-slate-400">
                        {payment.razorpayOrderId}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      ₹{(payment.amount / 100).toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        Upgrade to {payment.upgradeTo.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {payment.status === "SUCCESS" && (
                        <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4" /> Success
                        </div>
                      )}
                      {payment.status === "FAILED" && (
                        <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-sm font-medium">
                          <XCircle className="w-4 h-4" /> Failed
                        </div>
                      )}
                      {payment.status === "PENDING" && (
                        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-sm font-medium">
                          <Clock className="w-4 h-4" /> Pending
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {payment.status === "SUCCESS" ? (
                        <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
                          <Download className="w-4 h-4" /> Receipt
                        </button>
                      ) : (
                        <span className="text-slate-400 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
