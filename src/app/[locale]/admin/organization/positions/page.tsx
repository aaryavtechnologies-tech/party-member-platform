import { prisma } from "@/lib/prisma";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import PositionsClient from "./PositionsClient";

export default async function PositionsPage() {
  const positions = await prisma.position.findMany({
    orderBy: { priority: "asc" },
    include: {
      _count: {
        select: { officeBearers: { where: { status: "ACTIVE" } } }
      }
    }
  });

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />
      <PositionsClient initialPositions={positions as any} />
    </div>
  );
}
