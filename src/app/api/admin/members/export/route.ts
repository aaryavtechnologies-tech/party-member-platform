import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as xlsx from "xlsx";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const members = await prisma.memberProfile.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    const exportData = members.map((m) => ({
      "Member ID": m.memberId,
      "Name": m.user.name || "N/A",
      "Email": m.user.email || "N/A",
      "Mobile": m.mobile,
      "Status": m.status,
      "Membership Type": m.membershipType.replace("_", " "),
      "State": m.state,
      "District": m.district,
      "Taluka": m.taluka || "",
      "Village": m.village || "",
      "Address": m.fullAddress,
      "Pincode": m.pincode,
      "Date of Birth": m.dob ? new Date(m.dob).toLocaleDateString() : "",
      "Gender": m.gender || "",
      "Aadhaar": m.aadhaar || "",
      "Voter ID": m.voterId || "",
      "Registered Date": new Date(m.createdAt).toLocaleDateString(),
    }));

    const worksheet = xlsx.utils.json_to_sheet(exportData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Members");

    const buf = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Disposition": 'attachment; filename="members_export.xlsx"',
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate Excel file" },
      { status: 500 }
    );
  }
}
