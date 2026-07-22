import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.faqCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { faqs: true },
        },
      },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching FAQ categories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nameEn, nameGu, slug, icon, sortOrder } = body;

    if (!nameEn || !nameGu) {
      return NextResponse.json(
        { success: false, message: "English and Gujarati names are required" },
        { status: 400 }
      );
    }

    const catSlug =
      slug ||
      nameEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const category = await prisma.faqCategory.create({
      data: {
        nameEn,
        nameGu,
        slug: catSlug,
        icon: icon || "HelpCircle",
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json({ success: true, category, message: "Category created" });
  } catch (error) {
    console.error("Error creating FAQ category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Category ID required" }, { status: 400 });
    }

    const category = await prisma.faqCategory.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, category, message: "Category updated" });
  } catch (error) {
    console.error("Error updating FAQ category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Category ID required" }, { status: 400 });
    }

    await prisma.faqCategory.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category" },
      { status: 500 }
    );
  }
}
