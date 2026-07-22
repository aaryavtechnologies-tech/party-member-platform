import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalFaqs, activeFaqs, featuredFaqs, totalCategories, topViewedFaqs, allFaqs] =
      await Promise.all([
        prisma.faq.count({ where: { deletedAt: null } }),
        prisma.faq.count({ where: { published: true, deletedAt: null } }),
        prisma.faq.count({ where: { featured: true, deletedAt: null } }),
        prisma.faqCategory.count(),
        prisma.faq.findMany({
          where: { published: true, deletedAt: null },
          orderBy: { views: "desc" },
          take: 5,
          include: { category: true },
        }),
        prisma.faq.findMany({
          where: { deletedAt: null },
          select: { views: true, helpfulCount: true, notHelpfulCount: true },
        }),
      ]);

    let totalViews = 0;
    let totalHelpful = 0;
    let totalNotHelpful = 0;

    allFaqs.forEach((f) => {
      totalViews += f.views;
      totalHelpful += f.helpfulCount;
      totalNotHelpful += f.notHelpfulCount;
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalFaqs,
        activeFaqs,
        featuredFaqs,
        totalCategories,
        totalViews,
        totalHelpful,
        totalNotHelpful,
        helpfulRate:
          totalHelpful + totalNotHelpful > 0
            ? `${Math.round((totalHelpful / (totalHelpful + totalNotHelpful)) * 100)}%`
            : "100%",
      },
      topViewedFaqs,
    });
  } catch (error) {
    console.error("Error fetching FAQ analytics:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch FAQ analytics" },
      { status: 500 }
    );
  }
}
