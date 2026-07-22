import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { faqId, vote, incrementView } = body;

    if (!faqId) {
      return NextResponse.json({ success: false, message: "FAQ ID is required" }, { status: 400 });
    }

    if (incrementView) {
      const updated = await prisma.faq.update({
        where: { id: faqId },
        data: { views: { increment: 1 } },
      });
      return NextResponse.json({ success: true, views: updated.views });
    }

    if (vote === "helpful") {
      const updated = await prisma.faq.update({
        where: { id: faqId },
        data: { helpfulCount: { increment: 1 } },
      });
      return NextResponse.json({ success: true, helpfulCount: updated.helpfulCount });
    }

    if (vote === "not_helpful") {
      const updated = await prisma.faq.update({
        where: { id: faqId },
        data: { notHelpfulCount: { increment: 1 } },
      });
      return NextResponse.json({ success: true, notHelpfulCount: updated.notHelpfulCount });
    }

    return NextResponse.json({ success: false, message: "Invalid vote action" }, { status: 400 });
  } catch (error) {
    console.error("Error logging FAQ vote/view:", error);
    return NextResponse.json(
      { success: false, message: "Failed to log interaction" },
      { status: 500 }
    );
  }
}
