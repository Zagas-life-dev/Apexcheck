import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ShieldCheckIcon,
  ClockIcon,
  AlertCircleIcon,
  DownloadIcon,
  ChevronRightIcon,
} from "lucide-react";
import { getPublishedItemById } from "@/lib/items";
import { ProductGallery } from "@/components/site/product-gallery";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { RequestQuoteButton } from "@/components/site/request-quote-button";
import { PdfDownloadButton } from "@/components/site/pdf-download-button";
import { PageViewTracker } from "@/components/page-view-tracker";
import { StockBadge } from "@/components/status-badge";
import { categoryLabel } from "@/lib/constants";
import { formatCurrency, retailPriceFor, sortTiers } from "@/lib/format";
import { resolveVisitorCurrency } from "@/lib/currency";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ itemId: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { itemId } = await params;
  const item = await getPublishedItemById(itemId);
  if (!item) return { title: "Item not found" };
  const image = item.images[0]?.url;
  const description =
    item.description?.trim() ||
    [item.brand, item.model].filter(Boolean).join(" ") ||
    `${categoryLabel(item.category)} — ${item.title}`;
  return {
    title: item.title,
    description,
    openGraph: {
      title: item.title,
      description,
      url: `${site.url}/catalog/${item._id}`,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ItemDetailPage({ params }: PageProps) {
  const { itemId } = await params;
  const [item, currency] = await Promise.all([
    getPublishedItemById(itemId),
    resolveVisitorCurrency(),
  ]);
  if (!item) notFound();

  const tiers = sortTiers(item.pricingTiers);
  const retail = retailPriceFor(item, currency);
  const waMessage = `Hello ${site.name}, I'm interested in "${item.title}" (${site.url}/catalog/${item._id}). Please share pricing and availability.`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageViewTracker itemId={item._id} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRightIcon className="size-3" />
        <Link href="/catalog" className="hover:text-foreground">Catalog</Link>
        <ChevronRightIcon className="size-3" />
        <span className="truncate text-foreground">{item.title}</span>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-2">
        <ProductGallery images={item.images} title={item.title} />

        <div>
          <div className="text-sm font-medium text-primary">
            {categoryLabel(item.category)}
          </div>
          <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">{item.title}</h1>
          {(item.brand || item.model) && (
            <p className="mt-1 text-sm text-muted-foreground">
              {[item.brand, item.model].filter(Boolean).join(" · ")}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StockBadge status={item.stockStatus} />
            {item.stockStatus === "preorder" && item.leadTime ? (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <ClockIcon className="size-3.5" /> Lead time: {item.leadTime}
              </span>
            ) : null}
          </div>

          {/* Pricing */}
          <div className="mt-5 rounded-xl border bg-card p-4">
            {retail != null ? (
              <div>
                <div className="text-xs text-muted-foreground">Retail price</div>
                <div className="text-3xl font-bold tabular-nums">
                  {formatCurrency(retail, currency)}
                </div>
              </div>
            ) : (
              <div className="text-lg font-medium">Contact us for pricing</div>
            )}

            {(() => {
              const priceTiers = tiers
                .map((t) => ({
                  minQty: t.minQty,
                  price: currency === "NGN" ? t.unitPriceNGN : t.unitPrice,
                }))
                .filter((t): t is { minQty: number; price: number } => t.price != null);
              if (priceTiers.length === 0) return null;
              return (
                <div className="mt-4">
                  <div className="text-xs font-medium text-muted-foreground">
                    Bulk / B2B pricing
                  </div>
                  <table className="mt-2 w-full text-sm">
                    <thead className="text-left text-xs text-muted-foreground">
                      <tr>
                        <th className="py-1 font-medium">Quantity</th>
                        <th className="py-1 text-right font-medium">Unit price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {priceTiers.map((t, i) => (
                        <tr key={i} className="border-t">
                          <td className="py-1.5">{t.minQty}+ units</td>
                          <td className="py-1.5 text-right font-medium tabular-nums">
                            {formatCurrency(t.price, currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>

          {item.requiresFullPayment ? (
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-600/20">
              <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
              This item requires full payment before processing (high-value / custom order).
            </p>
          ) : null}

          {/* CTAs */}
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <WhatsAppButton
              message={waMessage}
              itemId={item._id}
              label="Enquire on WhatsApp"
              className="w-full sm:w-auto"
            />
            <RequestQuoteButton itemId={item._id} itemTitle={item.title} />
          </div>

          {item.documents.length > 0 || item.retailPrice != null ? (
            <div className="mt-3">
              <PdfDownloadButton
                href={`/api/pdf/item/${item._id}`}
                itemId={item._id}
              />
            </div>
          ) : null}

          {item.warranty ? (
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Warranty:</span> {item.warranty}
            </p>
          ) : null}
        </div>
      </div>

      {/* Certifications */}
      {item.certifications.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Certifications</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.certifications.map((c, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm"
              >
                <ShieldCheckIcon className="size-4 text-primary" />
                <span className="font-medium">{c.name}</span>
                {c.number ? (
                  <span className="text-muted-foreground">· {c.number}</span>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Description */}
      {item.description ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        </section>
      ) : null}

      {/* Specifications */}
      {item.specs.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Specifications</h2>
          <div className="mt-3 overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <tbody className="divide-y">
                {item.specs.map((s, i) => (
                  <tr key={i} className="even:bg-muted/30">
                    <td className="w-1/3 px-4 py-2.5 font-medium text-muted-foreground">
                      {s.label}
                    </td>
                    <td className="px-4 py-2.5">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {/* Documents */}
      {item.documents.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Documents</h2>
          <ul className="mt-3 space-y-2">
            {item.documents.map((d, i) => (
              <li key={i}>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm hover:border-primary/40"
                >
                  <DownloadIcon className="size-4 text-muted-foreground" />
                  {d.label || d.url.split("/").pop()}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
