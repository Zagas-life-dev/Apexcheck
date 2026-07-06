import Link from "next/link";
import type { Metadata } from "next";
import { InboxIcon, PhoneIcon, MapPinIcon, PackageIcon } from "lucide-react";
import { connectToDatabase } from "@/lib/db";
import { Inquiry } from "@/models/Inquiry";
import { serialize, type SerializedInquiry } from "@/lib/types";
import {
  INQUIRY_STATUS_VALUES,
  BUYER_TYPES,
  type InquiryStatus,
} from "@/lib/constants";
import { Pill } from "@/components/status-badge";
import { formatDateTime } from "@/lib/format";
import { InquiryStatusControls } from "@/components/admin/inquiry-status-controls";
import { InquiryFilter } from "@/components/admin/inquiry-filter";

export const metadata: Metadata = { title: "Inquiries" };
export const dynamic = "force-dynamic";

const buyerTypeLabel = (v?: string) =>
  BUYER_TYPES.find((b) => b.value === v)?.label ?? v ?? "—";

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus =
    status && INQUIRY_STATUS_VALUES.includes(status as (typeof INQUIRY_STATUS_VALUES)[number])
      ? status
      : "";

  await connectToDatabase();
  const rows = await Inquiry.find(
    activeStatus ? { status: activeStatus as InquiryStatus } : {}
  )
    .sort({ createdAt: -1 })
    .lean();
  const inquiries = serialize<SerializedInquiry[]>(rows);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Inquiries</h1>
          <p className="text-sm text-muted-foreground">{inquiries.length} shown</p>
        </div>
        <InquiryFilter value={activeStatus} />
      </div>

      {inquiries.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card p-12 text-center">
          <InboxIcon className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No inquiries to show.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div key={inq._id} className="rounded-xl border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{inq.contactName}</span>
                    <Pill tone={inq.buyerType === "business" ? "teal" : "slate"}>
                      {buyerTypeLabel(inq.buyerType)}
                    </Pill>
                  </div>
                  {inq.companyName ? (
                    <div className="text-sm text-muted-foreground">{inq.companyName}</div>
                  ) : null}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDateTime(inq.createdAt)}
                </div>
              </div>

              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <PhoneIcon className="size-3.5 text-muted-foreground" />
                  <a href={`tel:${inq.contactInfo}`} className="hover:underline">
                    {inq.contactInfo}
                  </a>
                </div>
                {inq.itemTitle ? (
                  <div className="flex items-center gap-2">
                    <PackageIcon className="size-3.5 text-muted-foreground" />
                    {inq.itemId ? (
                      <Link href={`/admin/items/${inq.itemId}`} className="hover:underline">
                        {inq.itemTitle}
                      </Link>
                    ) : (
                      <span>{inq.itemTitle}</span>
                    )}
                    {inq.quantity ? (
                      <span className="text-muted-foreground">× {inq.quantity}</span>
                    ) : null}
                  </div>
                ) : null}
                {inq.deliveryLocation ? (
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="size-3.5 text-muted-foreground" />
                    <span>{inq.deliveryLocation}</span>
                  </div>
                ) : null}
              </div>

              {inq.notes ? (
                <p className="mt-2 rounded-lg bg-muted/50 p-2.5 text-sm text-muted-foreground">
                  {inq.notes}
                </p>
              ) : null}

              <div className="mt-4 border-t pt-3">
                <InquiryStatusControls
                  id={inq._id}
                  status={inq.status}
                  paymentStatus={inq.paymentStatus}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
