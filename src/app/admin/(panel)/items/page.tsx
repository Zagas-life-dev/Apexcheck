import Link from "next/link";
import type { Metadata } from "next";
import { PlusIcon, PencilIcon, PackageIcon } from "lucide-react";
import { connectToDatabase } from "@/lib/db";
import { Item } from "@/models/Item";
import { serialize, type SerializedItem } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { categoryLabel } from "@/lib/constants";
import { StockBadge, Pill } from "@/components/status-badge";
import { formatCurrency } from "@/lib/format";
import { DeleteItemButton } from "@/components/admin/delete-item-button";

export const metadata: Metadata = { title: "Items" };
export const dynamic = "force-dynamic";

async function getItems(): Promise<SerializedItem[]> {
  await connectToDatabase();
  const rows = await Item.find().sort({ updatedAt: -1 }).lean();
  return serialize<SerializedItem[]>(rows);
}

export default async function ItemsPage() {
  const items = await getItems();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Items</h1>
          <p className="text-sm text-muted-foreground">{items.length} total</p>
        </div>
        <Link href="/admin/items/new" className={cn(buttonVariants({ size: "sm" }))}>
          <PlusIcon /> Add item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card p-12 text-center">
          <PackageIcon className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No items yet. Add your first product.</p>
          <Link href="/admin/items/new" className={cn(buttonVariants({ size: "sm" }))}>
            <PlusIcon /> Add item
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">Item</th>
                <th className="px-4 py-2.5 font-medium">Category</th>
                <th className="px-4 py-2.5 font-medium">Retail</th>
                <th className="px-4 py-2.5 font-medium">Stock</th>
                <th className="px-4 py-2.5 font-medium">Visibility</th>
                <th className="px-4 py-2.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 shrink-0 overflow-hidden rounded-md border bg-muted">
                        {item.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.images[0].url}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/items/${item._id}`}
                          className="block truncate font-medium hover:underline"
                        >
                          {item.title}
                        </Link>
                        <div className="truncate text-xs text-muted-foreground">
                          {[item.brand, item.model].filter(Boolean).join(" · ") || "—"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {categoryLabel(item.category)}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    <div>{formatCurrency(item.retailPrice)}</div>
                    {item.retailPriceNGN != null ? (
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(item.retailPriceNGN, "NGN")}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <StockBadge status={item.stockStatus} />
                  </td>
                  <td className="px-4 py-3">
                    {item.published ? (
                      <Pill tone="green">Published</Pill>
                    ) : (
                      <Pill tone="slate">Draft</Pill>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/items/${item._id}`}
                        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
                        aria-label="Edit item"
                      >
                        <PencilIcon />
                      </Link>
                      <DeleteItemButton id={item._id} title={item.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
