"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

// --- Organization Levels ---

export async function getOrganizationLevels() {
  try {
    const levels = await prisma.organizationLevel.findMany({
      where: { deletedAt: null },
      orderBy: { priority: 'asc' }
    });
    return { success: true, levels };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- Organization Units ---

export async function getOrganizationUnits(levelId?: string) {
  try {
    const units = await prisma.organizationUnit.findMany({
      where: { 
        deletedAt: null,
        ...(levelId ? { levelId } : {})
      },
      include: {
        level: true,
        parent: true
      },
      orderBy: { nameEn: 'asc' }
    });
    return { success: true, units };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- Positions ---

export async function getPositions() {
  try {
    const positions = await prisma.position.findMany({
      where: { deletedAt: null },
      include: { level: true },
      orderBy: { priority: 'asc' }
    });
    return { success: true, positions };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- Departments ---

export async function getDepartments() {
  try {
    const departments = await prisma.department.findMany({
      where: { deletedAt: null },
      orderBy: { nameEn: 'asc' }
    });
    return { success: true, departments };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- Office Bearers ---

const assignOfficeBearerSchema = z.object({
  memberId: z.string().uuid(),
  positionId: z.string().uuid(),
  departmentId: z.string().uuid().optional().nullable(),
  unitId: z.string().uuid(),
  startDate: z.date(),
  appointmentOrder: z.string().optional(),
});

export async function assignOfficeBearer(data: z.infer<typeof assignOfficeBearerSchema>) {
  try {
    const validatedData = assignOfficeBearerSchema.parse(data);

    const bearer = await prisma.$transaction(async (tx) => {
      const newBearer = await tx.officeBearer.create({
        data: {
          memberId: validatedData.memberId,
          positionId: validatedData.positionId,
          departmentId: validatedData.departmentId,
          unitId: validatedData.unitId,
          startDate: validatedData.startDate,
          appointmentOrder: validatedData.appointmentOrder,
          status: 'ACTIVE'
        }
      });

      // Log Assignment
      await tx.organizationAssignment.create({
        data: {
          officeBearerId: newBearer.id,
          action: 'ASSIGNED',
          remarks: 'Assigned via Admin Dashboard'
        }
      });

      return newBearer;
    });

    return { success: true, bearer };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getOfficeBearers(filters?: { levelId?: string, unitId?: string, positionId?: string, departmentId?: string }) {
  try {
    const bearers = await prisma.officeBearer.findMany({
      where: {
        deletedAt: null,
        ...(filters?.unitId ? { unitId: filters.unitId } : {}),
        ...(filters?.positionId ? { positionId: filters.positionId } : {}),
        ...(filters?.departmentId ? { departmentId: filters.departmentId } : {}),
        ...(filters?.levelId ? { unit: { levelId: filters.levelId } } : {}),
      },
      include: {
        member: {
          include: { user: true }
        },
        position: true,
        department: true,
        unit: {
          include: { level: true }
        }
      },
      orderBy: { startDate: 'desc' }
    });
    return { success: true, bearers };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Fetch complete public hierarchy
export async function getOrganizationHierarchy() {
  try {
    // Fetch levels first
    const levels = await prisma.organizationLevel.findMany({
      where: { deletedAt: null },
      orderBy: { priority: 'asc' }
    });

    // We can fetch units, positions for public display.
    // In a real app this would be more complex and cached.
    
    return { success: true, levels };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
