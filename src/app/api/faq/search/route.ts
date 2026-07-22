import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const featuredOnly = searchParams.get("featured") === "true";

    const where: any = {
      published: true,
      deletedAt: null,
    };

    if (featuredOnly) {
      where.featured = true;
    }

    if (category && category !== "all" && category !== "ALL") {
      where.OR = [
        { categoryId: category },
        { category: { slug: category } },
      ];
    }

    if (q.trim()) {
      where.OR = [
        { questionEn: { contains: q, mode: "insensitive" } },
        { questionGu: { contains: q, mode: "insensitive" } },
        { answerEn: { contains: q, mode: "insensitive" } },
        { answerGu: { contains: q, mode: "insensitive" } },
        { keywords: { contains: q, mode: "insensitive" } },
      ];
    }

    const [faqs, categories] = await Promise.all([
      prisma.faq.findMany({
        where,
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
        include: {
          category: {
            select: { id: true, nameEn: true, nameGu: true, slug: true, icon: true },
          },
        },
      }),
      prisma.faqCategory.findMany({
        where: { status: "ACTIVE" },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      faqs,
      categories,
      total: faqs.length,
    });
  } catch (error) {
    console.error("Error searching FAQs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}
