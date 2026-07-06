import { NextResponse, type NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Item } from "@/models/Item";
import { requireSession, jsonError, unauthorized } from "@/lib/api";
import { itemInputSchema } from "@/lib/validators";
import { deleteStoredFile } from "@/lib/storage";
import { serialize, type SerializedItem } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

async function loadId(ctx: Ctx) {
  const { id } = await ctx.params;
  return mongoose.isValidObjectId(id) ? id : null;
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  if (!(await requireSession())) return unauthorized();
  const id = await loadId(ctx);
  if (!id) return jsonError("Not found", 404);
  await connectToDatabase();
  const item = await Item.findById(id).lean();
  if (!item) return jsonError("Not found", 404);
  return NextResponse.json({ item: serialize<SerializedItem>(item) });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!(await requireSession())) return unauthorized();
  const id = await loadId(ctx);
  if (!id) return jsonError("Not found", 404);
  const parsed = itemInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return jsonError("Validation failed", 422, { issues: parsed.error.flatten() });
  }
  await connectToDatabase();
  const item = await Item.findByIdAndUpdate(id, parsed.data, {
    new: true,
    runValidators: true,
  }).lean();
  if (!item) return jsonError("Not found", 404);
  return NextResponse.json({ item: serialize<SerializedItem>(item) });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  if (!(await requireSession())) return unauthorized();
  const id = await loadId(ctx);
  if (!id) return jsonError("Not found", 404);
  await connectToDatabase();
  const item = await Item.findById(id);
  if (!item) return jsonError("Not found", 404);

  // Best-effort cleanup of remote (Cloudinary) assets before removing the doc.
  const publicIds = [
    ...(item.images ?? []).map((i) => i.publicId),
    ...(item.documents ?? []).map((d) => (d as { publicId?: string }).publicId),
  ].filter(Boolean) as string[];
  await Promise.allSettled(publicIds.map((pid) => deleteStoredFile(pid)));

  await item.deleteOne();
  return NextResponse.json({ ok: true });
}
