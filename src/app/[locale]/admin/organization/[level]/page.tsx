import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import OrganizationLevelClient from "./OrganizationLevelClient";

export default async function OrganizationLevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  
  // Validate level string
  const validLevels = ["national", "state", "district", "taluka", "village"];
  if (!validLevels.includes(level.toLowerCase())) {
    notFound();
  }

  const enumLevel = level.toUpperCase() as "NATIONAL" | "STATE" | "DISTRICT" | "TALUKA" | "VILLAGE";
  const parentLevelName = 
    enumLevel === "STATE" ? "national" :
    enumLevel === "DISTRICT" ? "state" :
    enumLevel === "TALUKA" ? "district" :
    enumLevel === "VILLAGE" ? "taluka" : null;

  // Fetch data
  const units = await prisma.organizationUnit.findMany({
    where: { level: { nameEn: { equals: level, mode: 'insensitive' } } },
    include: {
      parent: { select: { id: true, nameEn: true } },
      _count: {
        select: { officeBearers: { where: { status: "ACTIVE" } } }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Fetch Parent Units for the dropdown
  let parentUnits: { id: string, nameEn: string }[] = [];
  if (parentLevelName) {
    parentUnits = await prisma.organizationUnit.findMany({
      where: { level: { nameEn: { equals: parentLevelName, mode: "insensitive" } } },
      select: { id: true, nameEn: true },
      orderBy: { nameEn: "asc" }
    });
  }

  const title = level.charAt(0).toUpperCase() + level.slice(1);

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs />
      <OrganizationLevelClient 
        initialUnits={units as any} 
        parentUnits={parentUnits} 
        levelName={title} 
        enumLevel={enumLevel} 
      />
    </div>
  );
}
