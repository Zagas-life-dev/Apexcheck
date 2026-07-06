import { NextResponse, type NextRequest } from "next/server";
import { requireSession, jsonError, unauthorized } from "@/lib/api";
import { uploadFile } from "@/lib/storage";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB
const MAX_DOC_BYTES = 25 * 1024 * 1024; // 25 MB

export async function POST(req: NextRequest) {
  if (!(await requireSession())) return unauthorized();

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const kind = form?.get("kind") === "document" ? "document" : "image";

  if (!(file instanceof File)) return jsonError("No file provided");
  const max = kind === "image" ? MAX_IMAGE_BYTES : MAX_DOC_BYTES;
  if (file.size > max) return jsonError("File is too large", 413);

  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    const stored = await uploadFile({ buffer, filename: file.name || "upload", kind });
    return NextResponse.json(stored, { status: 201 });
  } catch (e) {
    console.error("[upload] failed:", e);
    return jsonError("Upload failed", 500);
  }
}
