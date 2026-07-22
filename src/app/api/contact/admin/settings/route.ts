import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, payload } = body;

    if (!type || !payload) {
      return NextResponse.json({ success: false, message: "Type and payload are required" }, { status: 400 });
    }

    if (type === "OFFICE") {
      const office = await prisma.contactOffice.upsert({
        where: { id: payload.id || "00000000-0000-0000-0000-000000000000" },
        update: {
          officeNameEn: payload.officeNameEn,
          officeNameGu: payload.officeNameGu,
          addressEn: payload.addressEn,
          addressGu: payload.addressGu,
          phone: payload.phone,
          email: payload.email,
          website: payload.website,
          googleMapUrl: payload.googleMapUrl,
          embedMapUrl: payload.embedMapUrl,
        },
        create: {
          officeNameEn: payload.officeNameEn,
          officeNameGu: payload.officeNameGu,
          addressEn: payload.addressEn,
          addressGu: payload.addressGu,
          phone: payload.phone,
          email: payload.email,
          website: payload.website,
          googleMapUrl: payload.googleMapUrl,
          embedMapUrl: payload.embedMapUrl,
          isHeadquarters: true,
        },
      });

      if (payload.workingHours && Array.isArray(payload.workingHours)) {
        await prisma.contactWorkingHour.deleteMany({ where: { officeId: office.id } });
        await prisma.contactWorkingHour.createMany({
          data: payload.workingHours.map((wh: any, idx: number) => ({
            officeId: office.id,
            dayRangeEn: wh.dayRangeEn,
            dayRangeGu: wh.dayRangeGu,
            timingEn: wh.timingEn,
            timingGu: wh.timingGu,
            isClosed: wh.isClosed || false,
            order: idx + 1,
          })),
        });
      }

      return NextResponse.json({ success: true, message: "Office details updated successfully" });
    }

    if (type === "SOCIAL_LINKS") {
      if (Array.isArray(payload)) {
        for (const item of payload) {
          await prisma.contactSocialLink.upsert({
            where: { platform: item.platform },
            update: {
              url: item.url || "",
              isEnabled: item.isEnabled !== false,
              platformNameEn: item.platformNameEn,
              platformNameGu: item.platformNameGu,
            },
            create: {
              platform: item.platform,
              platformNameEn: item.platformNameEn || item.platform,
              platformNameGu: item.platformNameGu || item.platform,
              url: item.url || "",
              isEnabled: item.isEnabled !== false,
            },
          });
        }
      }
      return NextResponse.json({ success: true, message: "Social links updated successfully" });
    }

    if (type === "FAQ") {
      if (payload.action === "CREATE") {
        await prisma.contactFaq.create({
          data: {
            questionEn: payload.questionEn,
            questionGu: payload.questionGu,
            answerEn: payload.answerEn,
            answerGu: payload.answerGu,
            category: payload.category || "GENERAL",
            isEnabled: payload.isEnabled !== false,
            order: payload.order || 1,
          },
        });
      } else if (payload.action === "UPDATE" && payload.id) {
        await prisma.contactFaq.update({
          where: { id: payload.id },
          data: {
            questionEn: payload.questionEn,
            questionGu: payload.questionGu,
            answerEn: payload.answerEn,
            answerGu: payload.answerGu,
            category: payload.category,
            isEnabled: payload.isEnabled,
          },
        });
      } else if (payload.action === "DELETE" && payload.id) {
        await prisma.contactFaq.delete({ where: { id: payload.id } });
      }
      return NextResponse.json({ success: true, message: "FAQ list updated successfully" });
    }

    if (type === "SETTING") {
      const { key, value } = payload;
      await prisma.contactSetting.upsert({
        where: { key },
        update: { value: typeof value === "string" ? value : JSON.stringify(value) },
        create: { key, value: typeof value === "string" ? value : JSON.stringify(value) },
      });
      return NextResponse.json({ success: true, message: "Setting saved successfully" });
    }

    return NextResponse.json({ success: false, message: "Invalid setting type" }, { status: 400 });
  } catch (error) {
    console.error("Error updating contact settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update contact settings" },
      { status: 500 }
    );
  }
}
