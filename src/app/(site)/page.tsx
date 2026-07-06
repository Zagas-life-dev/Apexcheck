import Link from "next/link";
import {
  ShieldCheckIcon,
  TruckIcon,
  BadgeCheckIcon,
  ArrowRightIcon,
  Stethoscope,
  Activity,
  Accessibility,
  Pill,
  Boxes,
} from "lucide-react";
import { getPublishedItems } from "@/lib/items";
import { ProductCard } from "@/components/site/product-card";
import { WhatsAppButton } from "@/components/site/whatsapp-button";
import { PageViewTracker } from "@/components/page-view-tracker";
import { CATEGORIES } from "@/lib/constants";
import { site } from "@/lib/site";
import { resolveVisitorCurrency } from "@/lib/currency";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const categoryIcons: Record<string, React.ReactNode> = {
  diagnostic: <Stethoscope className="size-5" />,
  monitoring: <Activity className="size-5" />,
  mobility_aids: <Accessibility className="size-5" />,
  ppe: <ShieldCheckIcon className="size-5" />,
  consumables: <Pill className="size-5" />,
  equipment: <Boxes className="size-5" />,
};

export default async function LandingPage() {
  const [featured, currency] = await Promise.all([
    getPublishedItems({ limit: 8 }),
    resolveVisitorCurrency(),
  ]);

  return (
    <div>
      <PageViewTracker />

      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <BadgeCheckIcon className="size-3.5" /> Certified medical supplier
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {site.name}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{site.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalog" className={cn(buttonVariants({ size: "lg" }))}>
                Browse catalog <ArrowRightIcon />
              </Link>
              <WhatsAppButton
                message={`Hello ${site.name}, I'd like to make an enquiry.`}
                variant="outline"
                label="Talk to us"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-semibold">Shop by category</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.value}
              href={`/catalog?category=${c.value}`}
              className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center transition hover:border-primary/40 hover:shadow-sm"
            >
              <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                {categoryIcons[c.value]}
              </span>
              <span className="text-sm font-medium">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured products</h2>
          <Link href="/catalog" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            View all <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            No products published yet.
          </p>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((item) => (
              <ProductCard key={item._id} item={item} currency={currency} />
            ))}
          </div>
        )}
      </section>

      {/* Trust band */}
      <section className="mx-auto mt-12 max-w-6xl px-4">
        <div className="grid gap-4 rounded-2xl border bg-muted/30 p-6 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="mt-0.5 size-6 text-primary" />
            <div>
              <div className="font-medium">Certified & compliant</div>
              <p className="text-sm text-muted-foreground">
                CE-marked devices with Ghana FDA registration where applicable.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TruckIcon className="mt-0.5 size-6 text-primary" />
            <div>
              <div className="font-medium">Nationwide delivery</div>
              <p className="text-sm text-muted-foreground">{site.deliveryCoverage}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BadgeCheckIcon className="mt-0.5 size-6 text-primary" />
            <div>
              <div className="font-medium">Flexible payment</div>
              <p className="text-sm text-muted-foreground">
                {site.paymentMethods.join(", ")}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="rounded-2xl bg-primary px-6 py-10 text-center text-primary-foreground">
          <h2 className="text-2xl font-semibold">Need a quote for your clinic or hospital?</h2>
          <p className="mx-auto mt-2 max-w-xl text-primary-foreground/80">
            Send us your requirements and we&apos;ll get back to you with pricing and availability.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/catalog"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
            >
              Browse catalog
            </Link>
            <WhatsAppButton
              message={`Hello ${site.name}, I'd like a quote.`}
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              label="Request via WhatsApp"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
