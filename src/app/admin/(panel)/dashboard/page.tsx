import Link from "next/link";
import type { Metadata } from "next";
import {
  PackageIcon,
  InboxIcon,
  EyeIcon,
  UsersIcon,
  PlusIcon,
  ArrowRightIcon,
} from "lucide-react";
import { getDashboardStats } from "@/lib/analytics-queries";
import { connectToDatabase } from "@/lib/db";
import { Inquiry } from "@/models/Inquiry";
import { serialize, type SerializedInquiry } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";
import { InquiryStatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

async function getRecentInquiries(): Promise<SerializedInquiry[]> {
  await connectToDatabase();
  const rows = await Inquiry.find().sort({ createdAt: -1 }).limit(6).lean();
  return serialize<SerializedInquiry[]>(rows);
}

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums">{value}</div>
      {hint ? <div className="mt-1 text-xs text-muted-foreground">{hint}</div> : null}
    </div>
  );
}

export default async function DashboardPage() {
  const [stats, recent] = await Promise.all([getDashboardStats(), getRecentInquiries()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your catalog and activity.</p>
        </div>
        <Link href="/admin/items/new" className={cn(buttonVariants({ size: "sm" }))}>
          <PlusIcon /> Add item
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Items"
          value={stats.items}
          hint={`${stats.publishedItems} published`}
          icon={<PackageIcon className="size-4" />}
        />
        <StatCard
          label="Inquiries"
          value={stats.inquiries}
          hint={`${stats.newInquiries} new`}
          icon={<InboxIcon className="size-4" />}
        />
        <StatCard
          label="Page views"
          value={stats.pageViews}
          icon={<EyeIcon className="size-4" />}
        />
        <StatCard
          label="Unique visitors"
          value={stats.uniqueSessions}
          icon={<UsersIcon className="size-4" />}
        />
      </div>

      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="font-medium">Recent inquiries</h2>
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View all <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No inquiries yet.
          </p>
        ) : (
          <ul className="divide-y">
            {recent.map((inq) => (
              <li key={inq._id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {inq.contactName}
                    {inq.companyName ? (
                      <span className="text-muted-foreground"> · {inq.companyName}</span>
                    ) : null}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {inq.itemTitle ?? "General inquiry"} · {inq.contactInfo}
                  </div>
                </div>
                <div className="hidden text-xs text-muted-foreground sm:block">
                  {formatDate(inq.createdAt)}
                </div>
                <InquiryStatusBadge status={inq.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
