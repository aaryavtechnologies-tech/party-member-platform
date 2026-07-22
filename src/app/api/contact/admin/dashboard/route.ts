import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      total,
      todayCount,
      pendingCount,
      repliedCount,
      closedCount,
      newCount,
      inProgressCount,
      allInquiries,
    ] = await Promise.all([
      prisma.contactInquiry.count(),
      prisma.contactInquiry.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.contactInquiry.count({ where: { status: "PENDING" } }),
      prisma.contactInquiry.count({ where: { status: "REPLIED" } }),
      prisma.contactInquiry.count({ where: { status: "CLOSED" } }),
      prisma.contactInquiry.count({ where: { status: "NEW" } }),
      prisma.contactInquiry.count({ where: { status: "IN_PROGRESS" } }),
      prisma.contactInquiry.findMany({
        select: {
          id: true,
          subject: true,
          state: true,
          district: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 500,
      }),
    ]);

    // Average Response Time Calculation (for replied/closed inquiries)
    let totalResponseTimeMs = 0;
    let respondedCount = 0;

    allInquiries.forEach((item) => {
      if (item.status === "REPLIED" || item.status === "CLOSED") {
        const diff = item.updatedAt.getTime() - item.createdAt.getTime();
        totalResponseTimeMs += diff;
        respondedCount++;
      }
    });

    const avgResponseTimeHours =
      respondedCount > 0
        ? (totalResponseTimeMs / (respondedCount * 1000 * 3600)).toFixed(1)
        : "2.4";

    // State-wise distribution
    const stateMap: Record<string, number> = {};
    const categoryMap: Record<string, number> = {};

    allInquiries.forEach((item) => {
      const st = item.state || "Gujarat";
      stateMap[st] = (stateMap[st] || 0) + 1;

      // Group subject into categories
      const subjLower = item.subject.toLowerCase();
      let category = "General Inquiry";
      if (subjLower.includes("member")) category = "Membership";
      else if (subjLower.includes("district") || subjLower.includes("taluka")) category = "District Office";
      else if (subjLower.includes("media") || subjLower.includes("press")) category = "Media & Press";
      else if (subjLower.includes("volunteer")) category = "Volunteer";
      else if (subjLower.includes("complaint")) category = "Complaints";
      else if (subjLower.includes("suggestion")) category = "Suggestions";

      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    const stateDistribution = Object.keys(stateMap).map((key) => ({
      name: key,
      value: stateMap[key],
    }));

    const categoryDistribution = Object.keys(categoryMap).map((key) => ({
      name: key,
      value: categoryMap[key],
    }));

    // Generate last 7 days daily inquiry counts
    const dailyTrends = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

      const dayCount = allInquiries.filter(
        (item) => item.createdAt.toISOString().split("T")[0] === dateStr
      ).length;

      dailyTrends.push({
        date: label,
        inquiries: dayCount,
      });
    }

    return NextResponse.json({
      success: true,
      stats: {
        total,
        todayCount,
        newCount,
        pendingCount,
        inProgressCount,
        repliedCount,
        closedCount,
        avgResponseTimeHours: `${avgResponseTimeHours} hrs`,
      },
      charts: {
        dailyTrends,
        stateDistribution,
        categoryDistribution,
      },
    });
  } catch (error) {
    console.error("Error fetching contact dashboard metrics:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard metrics" },
      { status: 500 }
    );
  }
}
