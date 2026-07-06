import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Inquiry } from "@/models/Inquiry";
import { requireSession, unauthorized } from "@/lib/api";
import { INQUIRY_STATUS_VALUES, type InquiryStatus } from "@/lib/constants";
import { serialize, type SerializedInquiry } from "@/lib/types";

export async function GET(req: NextRequest) {
  if (!(await requireSession())) return unauthorized();
  await connectToDatabase();

  const status = req.nextUrl.searchParams.get("status");
  const filter =
    status && INQUIRY_STATUS_VALUES.includes(status as InquiryStatus)
      ? { status: status as InquiryStatus }
      : {};

  const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ inquiries: serialize<SerializedInquiry[]>(inquiries) });
}
