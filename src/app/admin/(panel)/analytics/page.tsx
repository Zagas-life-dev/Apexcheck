import type { Metadata } from "next";
import { EyeIcon, UsersIcon, MessageCircleIcon, FileTextIcon } from "lucide-react";
import { getDashboardStats, getItemAnalytics } from "@/lib/analytics-queries";
import { categoryLabel } from "@/lib/constants";

export const metadata: Metadata = { title: "Analytics" };
export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

export default async function AnalyticsPage() {
  const [stats, rows] = await Promise.all([getDashboardStats(), getItemAnalytics()]);
  const totalWhatsapp = rows.reduce((a, r) => a + r.whatsappClicks, 0);
  const totalQuotes = rows.reduce((a, r) => a + r.quoteRequests, 0);
  const ranked = rows.filter(
    (r) => r.views + r.whatsappClicks + r.pdfDownloads + r.quoteRequests > 0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Traffic and engagement across your catalog.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Page views" value={stats.pageViews} icon={<EyeIcon className="size-4" />} />
        <StatCard
          label="Unique visitors"
          value={stats.uniqueSessions}
          icon={<UsersIcon className="size-4" />}
        />
        <StatCard
          label="WhatsApp clicks"
          value={totalWhatsapp}
          icon={<MessageCircleIcon className="size-4" />}
        />
        <StatCard
          label="Quote requests"
          value={totalQuotes}
          icon={<FileTextIcon className="size-4" />}
        />
      </div>

      <div className="rounded-xl border bg-card">
        <div className="border-b px-4 py-3">
          <h2 className="font-medium">Per-item performance</h2>
          <p className="text-xs text-muted-foreground">Ranked by views.</p>
        </div>
        {ranked.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            No activity recorded yet. Data appears here as visitors browse the catalog.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">#</th>
                  <th className="px-4 py-2.5 font-medium">Item</th>
                  <th className="px-4 py-2.5 text-right font-medium">Views</th>
                  <th className="px-4 py-2.5 text-right font-medium">WhatsApp</th>
                  <th className="px-4 py-2.5 text-right font-medium">PDF</th>
                  <th className="px-4 py-2.5 text-right font-medium">Quotes</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ranked.map((r, i) => (
                  <tr key={r.itemId} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-muted-foreground tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{r.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {categoryLabel(r.category)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{r.views}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{r.whatsappClicks}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{r.pdfDownloads}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{r.quoteRequests}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
