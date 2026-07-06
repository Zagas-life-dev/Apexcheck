import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { env, isCloudinaryConfigured } from "@/lib/env";

let cloudinaryReady = false;
function ensureCloudinaryConfig() {
  if (cloudinaryReady) return;
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
    secure: true,
  });
  cloudinaryReady = true;
}

export type UploadKind = "image" | "document";

export interface StoredFile {
  url: string;
  publicId?: string;
}

export interface UploadInput {
  buffer: Buffer;
  filename: string;
  kind: UploadKind;
}

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80) || "file";
}

async function uploadToCloudinary({ buffer, filename, kind }: UploadInput): Promise<StoredFile> {
  ensureCloudinaryConfig();
  const resourceType = kind === "image" ? "image" : "raw";
  return new Promise<StoredFile>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: env.cloudinary.folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
        filename_override: safeName(filename),
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Cloudinary upload failed"));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

// Dev-only fallback: persist to /public/uploads and serve from /uploads/*.
async function uploadToLocalDisk({ buffer, filename }: UploadInput): Promise<StoredFile> {
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const unique = `${Date.now()}-${randomBytes(5).toString("hex")}-${safeName(filename)}`;
  await writeFile(path.join(dir, unique), buffer);
  return { url: `/uploads/${unique}`, publicId: `local/${unique}` };
}

export async function uploadFile(input: UploadInput): Promise<StoredFile> {
  if (isCloudinaryConfigured()) return uploadToCloudinary(input);
  return uploadToLocalDisk(input);
}

export async function deleteStoredFile(publicId?: string): Promise<void> {
  if (!publicId) return;
  // Local files are left in place; only remote Cloudinary assets are removed.
  if (publicId.startsWith("local/")) return;
  if (!isCloudinaryConfigured()) return;
  ensureCloudinaryConfig();
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (e) {
    console.warn("[storage] failed to delete Cloudinary asset", publicId, e);
  }
}
