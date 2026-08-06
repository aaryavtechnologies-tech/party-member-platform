import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import UnitDetailsClient from "./UnitDetailsClient";

export default async function UnitDetailsPage({ params }: { params: Promise<{ unitId: string }> }) {
  const { unitId } = await params;

  const unit = await prisma.organizationUnit.findUnique({
    where: { id: unitId },
    include: {
      level: true,
      parent: true,
      officeBearers: {
        include: {
          member: {
            include: { user: true }
          },
          position: true
        },
        orderBy: {
          position: { priority: "asc" }
        }
      }
    }
  });

  if (!unit) {
    notFound();
  }

  // Fetch positions for assignment
  const positions = await prisma.position.findMany({
    where: { status: "ACTIVE" },
    orderBy: { priority: "asc" }
  });

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />
      <UnitDetailsClient unit={unit as any} positions={positions} />
    </div>
  );
}
