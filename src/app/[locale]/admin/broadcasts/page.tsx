import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import BroadcastClient from "./BroadcastClient";
import { prisma } from "@/lib/prisma";

export default async function BroadcastsPage() {
  const adminCount = await prisma.admin.count({ where: { isActive: true } });
  const memberCount = await prisma.memberProfile.count();

  // Fetch past broadcasts
  const pastBroadcasts = await prisma.broadcastNotification.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <AdminBreadcrumbs />
      
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Broadcasts & News</h1>
        <p className="text-slate-500 mt-1">Send in-app notifications and announcements to Admins, Members, or Everyone.</p>
      </div>

      <BroadcastClient 
        adminCount={adminCount} 
        memberCount={memberCount} 
        pastBroadcasts={pastBroadcasts}
      />
    </div>
  );
}
