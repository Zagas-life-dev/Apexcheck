import type { Metadata } from "next";
import { PackageSearchIcon } from "lucide-react";
import { getPublishedItems } from "@/lib/items";
import { ProductCard } from "@/components/site/product-card";
import { CatalogFilters } from "@/components/site/catalog-filters";
import { PageViewTracker } from "@/components/page-view-tracker";
import { categoryLabel } from "@/lib/constants";
import { resolveVisitorCurrency } from "@/lib/currency";

export const metadata: Metadata = { title: "Catalog" };
export const dynamic = "force-dynamic";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q = "", category = "" } = await searchParams;
  const [items, currency] = await Promise.all([
    getPublishedItems({ q, category }),
    resolveVisitorCurrency(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageViewTracker />
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Catalog</h1>
        <p className="text-sm text-muted-foreground">
          {category ? `${categoryLabel(category)} · ` : ""}
          {items.length} product{items.length === 1 ? "" : "s"}
          {q ? ` matching “${q}”` : ""}
        </p>
      </div>

      <CatalogFilters q={q} category={category} />

      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-dashed p-12 text-center">
          <PackageSearchIcon className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No products found. Try a different search or category.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <ProductCard key={item._id} item={item} currency={currency} />
          ))}
        </div>
      )}
    </div>
  );
}
