// src/app/[locale]/organization/state/page.tsx

import { getAdminsByRole, countMembersByLocation } from "@/actions/public/organization";
import { AdminRole } from "@prisma/client";
import "@/styles/designTokens.css";

export const dynamic = "force-static";

export default async function StateTeamPage() {
  const admins = await getAdminsByRole(AdminRole.STATE_ADMIN);

  // Fetch member counts for each state in parallel
  const counts = await Promise.all(
    admins.map((admin) =>
      countMembersByLocation({ state: admin.state ?? undefined })
    )
  );

  return (
    <section className="p-6 min-h-screen bg-gray-50 dark:bg-slate-900">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">State Team</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {admins.map((admin, idx) => (
          <div key={admin.id} className="bg-white dark:bg-slate-800 shadow-glass rounded transition hover-lift p-4 flex flex-col items-center">
            <img
              src={admin.profilePhoto ?? "/placeholder-avatar.png"}
              alt={admin.fullName}
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
            <h2 className="text-lg font-semibold text-primary mb-1">
              {admin.fullName}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {admin.state || "-"}
            </p>
            <span className="px-2 py-1 bg-primary text-white text-xs rounded">
              {counts[idx]} members
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
