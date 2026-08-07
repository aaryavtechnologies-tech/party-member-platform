// src/app/[locale]/admin/organization/national/page.tsx

import { getAdminsByRole } from "@/actions/public/organization";
import { AdminRole } from "@prisma/client";
import "@/styles/designTokens.css";

export const dynamic = "force-static";

export default async function NationalTeamAdminPage() {
  const admins = await getAdminsByRole(AdminRole.NATIONAL_ADMIN);

  return (
    <section className="p-6 min-h-screen bg-gray-50 dark:bg-slate-900">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">
        National Team (Admin View)
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {admins.map((admin) => (
          <div key={admin.id} className="bg-white dark:bg-slate-800 shadow-glass rounded transition hover-lift p-4 flex flex-col items-center">
            <img
              src={admin.profilePhoto ?? "/placeholder-avatar.png"}
              alt={admin.fullName}
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
            <h2 className="text-lg font-semibold text-primary mb-1">
              {admin.fullName}
            </h2>
            <span className="px-2 py-1 bg-primary text-white text-xs rounded">
              {admin.role}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
