import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/lib/auth";
import { getAdminSession } from "@/lib/admin-auth";
import { headers } from "next/headers";

// Allowed MIME types and their expected extensions
const ALLOWED_TYPES: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB (was 10MB — reduced)

export async function POST(req: NextRequest) {
  try {
    // Check Admin session (Super Admin, District Admin, etc.) or User session (Logged in member)
    const adminSession = await getAdminSession();
    let userSession = null;

    if (!adminSession) {
      try {
        userSession = await auth.api.getSession({
          headers: await headers(),
        });
      } catch {
        // Not a logged-in user (e.g. member registration form)
      }
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // SECURITY: Validate file size
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // SECURITY: Validate MIME type against allowlist
    const mimeType = file.type;
    if (!ALLOWED_TYPES[mimeType]) {
      return NextResponse.json(
        { error: "File type not allowed. Only JPEG, PNG, WebP, and GIF images are accepted." },
        { status: 400 }
      );
    }

    // SECURITY: Derive extension from MIME type (not from original filename)
    // This prevents extension spoofing (e.g. shell.php renamed to shell.png)
    const allowedExtensions = ALLOWED_TYPES[mimeType];
    const originalExt = extname(file.name).toLowerCase();
    
    // Use first allowed extension as canonical if original doesn't match
    const safeExtension = allowedExtensions.includes(originalExt)
      ? originalExt
      : allowedExtensions[0];

    // SECURITY: UUID filename — never use original filename
    const uniqueFileName = `${uuidv4()}${safeExtension}`;

    // Process file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads directory
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = join(uploadDir, uniqueFileName);
    await writeFile(filePath, buffer);

    const fileUrl = `/api/file/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: uniqueFileName, // Return safe name, not original
    });
  } catch (error) {
    console.error("Upload error:", error);
    // SECURITY: Don't expose internal error details
    return NextResponse.json(
      { error: "Failed to upload file. Please try again." },
      { status: 500 }
    );
  }
}
