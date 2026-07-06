import "server-only";
import { headers } from "next/headers";

export type Currency = "GHS" | "NGN";

const CURRENCY_BY_COUNTRY: Record<string, Currency> = {
  NG: "NGN",
};

export function currencyForCountry(country?: string | null): Currency {
  if (!country) return "GHS";
  return CURRENCY_BY_COUNTRY[country.toUpperCase()] ?? "GHS";
}

// Vercel's edge network sets this header on every request; absent in local
// dev and on other hosts, in which case we default to GHS (the home market).
export async function resolveVisitorCurrency(): Promise<Currency> {
  const h = await headers();
  return currencyForCountry(h.get("x-vercel-ip-country"));
}
