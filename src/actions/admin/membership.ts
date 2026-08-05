"use server";

import { prisma } from "@/lib/prisma";
import { MembershipTier, MemberStatus } from "@prisma/client";

export async function getMembershipStats() {
  try {
    const totalMembers = await prisma.memberProfile.count();

    const activeMembers = await prisma.memberProfile.count({
      where: { status: "ACTIVE" }
    });

    const primaryMembers = await prisma.memberProfile.count({
      where: { membershipType: "PRIMARY", status: "ACTIVE" }
    });

    const lifetimePrimary = await prisma.memberProfile.count({
      where: { membershipType: "LIFETIME_PRIMARY", status: "ACTIVE" }
    });

    const lifetimeActive = await prisma.memberProfile.count({
      where: { membershipType: "LIFETIME_ACTIVE", status: "ACTIVE" }
    });

    const recentUpgrades = await prisma.membershipHistory.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30))
        }
      }
    });

    // Approximate revenue from successful payments for membership upgrades
    const revenueAggregation = await prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true }
    });

    const totalRevenue = (revenueAggregation._sum.amount || 0) / 100; // converted from paise to INR

    return {
      success: true,
      stats: {
        totalMembers,
        activeMembers,
        primaryMembers,
        lifetimePrimary,
        lifetimeActive,
        recentUpgrades,
        totalRevenue
      }
    };
  } catch (error) {
    console.error("Error fetching membership stats:", error);
    return { success: false, error: "Failed to fetch statistics" };
  }
}

export async function getMemberships(params: {
  page?: number;
  limit?: number;
  search?: string;
  tier?: string;
  status?: string;
}) {
  try {
    const { page = 1, limit = 20, search, tier, status } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { memberId: { contains: search, mode: "insensitive" } },
        { mobile: { contains: search } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } }
      ];
    }

    if (tier && tier !== "ALL") {
      where.membershipType = tier as MembershipTier;
    }

    if (status && status !== "ALL") {
      where.status = status as MemberStatus;
    }

    const [members, total] = await Promise.all([
      prisma.memberProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true
            }
          }
        }
      }),
      prisma.memberProfile.count({ where })
    ]);

    return {
      success: true,
      data: {
        members,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error("Error fetching memberships:", error);
    return { success: false, error: "Failed to fetch memberships" };
  }
}
