import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Item } from "@/models/Item";
import { requireSession, jsonError, unauthorized } from "@/lib/api";
import { itemInputSchema } from "@/lib/validators";
import { serialize, type SerializedItem } from "@/lib/types";

export async function GET() {
  if (!(await requireSession())) return unauthorized();
  await connectToDatabase();
  const items = await Item.find().sort({ updatedAt: -1 }).lean();
  return NextResponse.json({ items: serialize<SerializedItem[]>(items) });
}

export async function POST(req: NextRequest) {
  if (!(await requireSession())) return unauthorized();
  const parsed = itemInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return jsonError("Validation failed", 422, { issues: parsed.error.flatten() });
  }
  await connectToDatabase();
  const item = await Item.create(parsed.data);
  return NextResponse.json(
    { item: serialize<SerializedItem>(item.toObject()) },
    { status: 201 }
  );
}
