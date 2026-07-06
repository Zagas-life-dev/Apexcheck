import { NextResponse, type NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Inquiry } from "@/models/Inquiry";
import { requireSession, jsonError, unauthorized } from "@/lib/api";
import { inquiryUpdateSchema } from "@/lib/validators";
import { serialize, type SerializedInquiry } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!(await requireSession())) return unauthorized();
  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) return jsonError("Not found", 404);

  const parsed = inquiryUpdateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return jsonError("Validation failed", 422, { issues: parsed.error.flatten() });
  }

  await connectToDatabase();
  const inquiry = await Inquiry.findByIdAndUpdate(id, parsed.data, {
    new: true,
    runValidators: true,
  }).lean();
  if (!inquiry) return jsonError("Not found", 404);
  return NextResponse.json({ inquiry: serialize<SerializedInquiry>(inquiry) });
}
