import { NextResponse, type NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Event } from "@/models/Event";
import { eventInputSchema } from "@/lib/validators";

// Public, best-effort analytics endpoint. Always returns quickly; never throws
// to the client (tracking failures must not break the page).
export async function POST(req: NextRequest) {
  try {
    const parsed = eventInputSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return new NextResponse(null, { status: 204 });

    const { type, itemId, page, referrer, sessionId } = parsed.data;
    await connectToDatabase();
    await Event.create({
      type,
      itemId: itemId && mongoose.isValidObjectId(itemId) ? itemId : undefined,
      page,
      referrer,
      sessionId,
    });
  } catch (e) {
    console.warn("[events] tracking failed:", e);
  }
  return new NextResponse(null, { status: 204 });
}
