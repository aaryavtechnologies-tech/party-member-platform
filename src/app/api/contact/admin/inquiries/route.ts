import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const priority = searchParams.get("priority") || "";
    const state = searchParams.get("state") || "";
    const district = searchParams.get("district") || "";
    const archived = searchParams.get("archived") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {
      archived,
    };

    if (status && status !== "ALL") {
      where.status = status;
    }
    if (priority && priority !== "ALL") {
      where.priority = priority;
    }
    if (state) {
      where.state = { contains: state, mode: "insensitive" };
    }
    if (district) {
      where.district = { contains: district, mode: "insensitive" };
    }

    if (search) {
      where.OR = [
        { inquiryId: { contains: search, mode: "insensitive" } },
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { mobileNumber: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    const [inquiries, total] = await Promise.all([
      prisma.contactInquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          activityLogs: {
            orderBy: { createdAt: "desc" },
          },
        },
      }),
      prisma.contactInquiry.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      inquiries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error listing contact inquiries:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, priority, assignedTo, replyNotes, archived, actionLog } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Inquiry ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (replyNotes !== undefined) updateData.replyNotes = replyNotes;
    if (archived !== undefined) updateData.archived = archived;

    const inquiry = await prisma.contactInquiry.update({
      where: { id },
      data: updateData,
    });

    if (actionLog) {
      await prisma.contactActivityLog.create({
        data: {
          inquiryId: id,
          action: actionLog.action || "UPDATED",
          performedBy: actionLog.performedBy || "Admin User",
          remarks: actionLog.remarks || `Inquiry details updated. Status: ${inquiry.status}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      inquiry,
      message: "Inquiry updated successfully",
    });
  } catch (error) {
    console.error("Error updating contact inquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Inquiry ID is required" }, { status: 400 });
    }

    await prisma.contactInquiry.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
