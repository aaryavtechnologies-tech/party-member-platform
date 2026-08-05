import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/rbac";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getCmsLocationFilter } from "@/lib/cms-rbac";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdminAuth();
    
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate unique filename
    const extension = path.extname(file.name);
    const uniqueFilename = `${crypto.randomUUID()}${extension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "media", folder);
    
    // Ensure dir exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/media/${folder}/${uniqueFilename}`;

    // Save to DB with Admin's Location Scope
    const media = await prisma.mediaFile.create({
      data: {
        filename: uniqueFilename,
        originalName: file.name,
        filePath: filePath,
        mimeType: file.type,
        extension: extension,
        size: file.size,
        url: publicUrl,
        folder: folder,
        
        uploaderId: session.id,
        uploaderRole: session.role,
        state: session.state,
        district: session.district,
        taluka: session.taluka,
        village: session.village,
      }
    });

    return NextResponse.json({ success: true, media });

  } catch (error: any) {
    console.error("Media Upload Error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireAdminAuth();
    const locationFilter = getCmsLocationFilter(session);
    
    // Admins only see their scoped media files
    const files = await prisma.mediaFile.findMany({
      where: locationFilter,
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, files });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
