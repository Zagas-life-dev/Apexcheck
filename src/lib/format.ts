import { site } from "@/lib/site";
import type { Currency } from "@/lib/currency";
import type { PricingTier, SerializedItem } from "@/lib/types";

const CURRENCY_LOCALE: Record<Currency, string> = {
  GHS: "en-GH",
  NGN: "en-NG",
};

export function formatCurrency(
  amount?: number | null,
  currency: Currency = site.currency as Currency
): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  try {
    return new Intl.NumberFormat(CURRENCY_LOCALE[currency] ?? "en-US", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

// Picks the retail price for the given currency — no cross-currency fallback,
// missing means "no price set in that currency" (handled as "contact us").
export function retailPriceFor(
  item: Pick<SerializedItem, "retailPrice" | "retailPriceNGN">,
  currency: Currency
): number | undefined {
  return (currency === "NGN" ? item.retailPriceNGN : item.retailPrice) ?? undefined;
}

export function formatDate(value?: string | Date | null): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value?: string | Date | null): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Lowest achievable unit price across configured B2B tiers, for the given
// currency. Tiers missing a price in that currency are excluded (no fallback).
export function lowestTierPrice(
  tiers?: PricingTier[],
  currency: Currency = "GHS"
): number | undefined {
  if (!tiers || tiers.length === 0) return undefined;
  const values = tiers
    .map((t) => (currency === "NGN" ? t.unitPriceNGN : t.unitPrice))
    .filter((v): v is number => v != null);
  return values.length > 0 ? Math.min(...values) : undefined;
}

export function sortTiers(tiers: PricingTier[]): PricingTier[] {
  return [...tiers].sort((a, b) => a.minQty - b.minQty);
}
