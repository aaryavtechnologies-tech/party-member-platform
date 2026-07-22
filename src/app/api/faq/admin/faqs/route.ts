import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const status = searchParams.get("status") || "ALL"; // ACTIVE, TRASHED, ALL

    const where: any = {};

    if (status === "TRASHED") {
      where.deletedAt = { not: null };
    } else if (status === "ACTIVE") {
      where.deletedAt = null;
    } else {
      // ALL: include both active and soft-deleted if needed
    }

    if (categoryId && categoryId !== "ALL") {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { questionEn: { contains: search, mode: "insensitive" } },
        { questionGu: { contains: search, mode: "insensitive" } },
        { answerEn: { contains: search, mode: "insensitive" } },
        { answerGu: { contains: search, mode: "insensitive" } },
      ];
    }

    const faqs = await prisma.faq.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, faqs });
  } catch (error) {
    console.error("Error fetching admin FAQs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      categoryId,
      questionEn,
      questionGu,
      answerEn,
      answerGu,
      featured,
      published,
      sortOrder,
      metaTitle,
      metaDescription,
      keywords,
    } = body;

    if (!questionEn || !questionGu || !answerEn || !answerGu || !categoryId) {
      return NextResponse.json(
        { success: false, message: "Required fields are missing" },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      `faq-${Date.now()}-${questionEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")}`;

    const faq = await prisma.faq.create({
      data: {
        categoryId,
        questionEn,
        questionGu,
        answerEn,
        answerGu,
        featured: Boolean(featured),
        published: published !== false,
        sortOrder: sortOrder || 0,
        slug,
        metaTitle: metaTitle || questionEn,
        metaDescription: metaDescription || answerEn.substring(0, 150),
        keywords,
      },
    });

    return NextResponse.json({ success: true, faq, message: "FAQ created successfully" });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create FAQ" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "FAQ ID is required" }, { status: 400 });
    }

    const faq = await prisma.faq.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, faq, message: "FAQ updated successfully" });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update FAQ" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const mode = searchParams.get("mode") || "soft"; // soft, restore, permanent

    if (!id) {
      return NextResponse.json({ success: false, message: "FAQ ID is required" }, { status: 400 });
    }

    if (mode === "permanent") {
      await prisma.faq.delete({ where: { id } });
      return NextResponse.json({ success: true, message: "FAQ permanently deleted" });
    }

    if (mode === "restore") {
      await prisma.faq.update({
        where: { id },
        data: { deletedAt: null },
      });
      return NextResponse.json({ success: true, message: "FAQ restored successfully" });
    }

    // Default: Soft Delete
    await prisma.faq.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: "FAQ moved to trash" });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete FAQ" },
      { status: 500 }
    );
  }
}
