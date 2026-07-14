import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import crypto from "crypto";

// Allowed MIME types
const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const ALLOWED_DOCS = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const ALLOWED_VIDEOS = ["video/mp4", "video/quicktime", "video/webm"];

// Size limits (in bytes)
const MAX_IMAGE_SIZE = parseInt(process.env.MAX_IMAGE_SIZE || "10485760", 10); // 10MB
const MAX_DOC_SIZE = parseInt(process.env.MAX_DOCUMENT_SIZE || "26214400", 10); // 25MB
const MAX_VIDEO_SIZE = parseInt(process.env.MAX_VIDEO_SIZE || "524288000", 10); // 500MB

/**
 * Validates and normalizes the file before saving
 */
async function validateFile(file: File) {
  const mimeType = file.type;
  
  if (ALLOWED_IMAGES.includes(mimeType)) {
    if (file.size > MAX_IMAGE_SIZE) throw new Error("Image exceeds 10MB limit.");
    return "image";
  }
  
  if (ALLOWED_DOCS.includes(mimeType)) {
    if (file.size > MAX_DOC_SIZE) throw new Error("Document exceeds 25MB limit.");
    return "document";
  }
  
  if (ALLOWED_VIDEOS.includes(mimeType)) {
    if (file.size > MAX_VIDEO_SIZE) throw new Error("Video exceeds 500MB limit.");
    return "video";
  }
  
  throw new Error(`Unsupported file type: ${mimeType}`);
}

/**
 * Handles the physical upload of a file to the VPS local storage
 * Converts images to WEBP automatically.
 * 
 * @param file The file from FormData
 * @param folder The target subfolder (e.g., "gallery", "policies")
 */
export async function uploadFile(file: File, folder: string) {
  try {
    // 1. Validate File
    const fileCategory = await validateFile(file);
    
    // 2. Resolve Upload Path
    // In production, this should point to /var/www/ravp/storage
    // In local dev, it points to ./storage at project root
    const uploadRoot = process.env.UPLOAD_ROOT || path.join(process.cwd(), "storage");
    const targetDir = path.join(uploadRoot, folder);
    
    // Ensure directory exists
    await fs.mkdir(targetDir, { recursive: true });

    // 3. Generate Unique Filename
    const uniqueId = crypto.randomBytes(4).toString("hex").toUpperCase();
    const dateStr = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 8);
    
    let finalExt = path.extname(file.name).toLowerCase();
    let finalBuffer = Buffer.from(await file.arrayBuffer());
    let finalMime = file.type;
    
    // 4. Image Processing (Convert to WebP)
    if (fileCategory === "image" && file.type !== "image/svg+xml") {
      finalExt = ".webp";
      finalMime = "image/webp";
      finalBuffer = await sharp(finalBuffer)
        .webp({ quality: 80 })
        .toBuffer();
    }
    
    // e.g. IMG_20260714_A8F93K.webp
    const prefix = fileCategory === "image" ? "IMG" : fileCategory === "document" ? "DOC" : "VID";
    const finalFilename = `${prefix}_${dateStr}_${uniqueId}${finalExt}`;
    const filePath = path.join(targetDir, finalFilename);
    
    // 5. Write to File System
    await fs.writeFile(filePath, finalBuffer);
    
    // 6. Generate Public URL
    // In production: https://example.com/uploads/folder/filename.webp
    const publicBaseUrl = process.env.PUBLIC_UPLOAD_URL || "/api/uploads";
    const publicUrl = `${publicBaseUrl}/${folder}/${finalFilename}`;

    // 7. Store Metadata in Database
    const mediaRecord = await prisma.mediaFile.create({
      data: {
        filename: finalFilename,
        originalName: file.name,
        mimeType: finalMime,
        size: finalBuffer.length,
        url: publicUrl,
        // Assuming we expanded the schema as requested:
        // folder: folder,
        // extension: finalExt
      }
    });

    return {
      success: true,
      data: mediaRecord
    };

  } catch (error) {
    console.error("Upload failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown upload error"
    };
  }
}
