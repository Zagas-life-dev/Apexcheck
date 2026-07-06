import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { StockBadge } from "@/components/status-badge";
import { formatCurrency, lowestTierPrice, retailPriceFor } from "@/lib/format";
import { categoryLabel } from "@/lib/constants";
import type { Currency } from "@/lib/currency";
import type { SerializedItem } from "@/lib/types";

export function ProductCard({
  item,
  currency = "GHS",
}: {
  item: SerializedItem;
  currency?: Currency;
}) {
  const retail = retailPriceFor(item, currency);
  const tierLow = lowestTierPrice(item.pricingTiers, currency);
  const priceLabel =
    retail != null
      ? formatCurrency(retail, currency)
      : tierLow != null
        ? `From ${formatCurrency(tierLow, currency)}`
        : "Request quote";

  return (
    <Link
      href={`/catalog/${item._id}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {item.images[0] ? (
          <Image
            src={item.images[0].url}
            alt={item.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, 320px"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageIcon className="size-8" />
          </div>
        )}
        <div className="absolute left-2 top-2">
          <StockBadge status={item.stockStatus} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <div className="text-xs text-muted-foreground">{categoryLabel(item.category)}</div>
        <h3 className="mt-0.5 line-clamp-2 font-medium leading-snug transition-colors group-hover:text-primary">
          {item.title}
        </h3>
        {item.brand ? (
          <div className="mt-0.5 text-xs text-muted-foreground">{item.brand}</div>
        ) : null}
        <div className="mt-auto pt-2 font-semibold tabular-nums">{priceLabel}</div>
      </div>
    </Link>
  );
}
