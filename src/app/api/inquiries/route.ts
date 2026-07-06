import { NextResponse, type NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Inquiry } from "@/models/Inquiry";
import { Item } from "@/models/Item";
import { inquiryInputSchema } from "@/lib/validators";
import { jsonError } from "@/lib/api";
import { notifyNewInquiry } from "@/lib/email";
import { serialize, type SerializedInquiry } from "@/lib/types";

// Public endpoint: buyers submit inquiries / quote requests.
export async function POST(req: NextRequest) {
  const parsed = inquiryInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return jsonError("Please check the form and try again", 422, {
      issues: parsed.error.flatten(),
    });
  }

  await connectToDatabase();

  const data = parsed.data;
  let itemTitle: string | undefined;
  if (data.itemId && mongoose.isValidObjectId(data.itemId)) {
    const item = await Item.findById(data.itemId).select("title").lean();
    itemTitle = item?.title;
  }

  const inquiry = await Inquiry.create({
    ...data,
    itemId: data.itemId && mongoose.isValidObjectId(data.itemId) ? data.itemId : undefined,
    itemTitle,
  });

  // Fire-and-forget admin notification (no-ops to console if email unconfigured).
  notifyNewInquiry(serialize<SerializedInquiry>(inquiry.toObject())).catch((e) =>
    console.error("[inquiry] notification failed:", e)
  );

  return NextResponse.json({ ok: true, id: String(inquiry._id) }, { status: 201 });
}
