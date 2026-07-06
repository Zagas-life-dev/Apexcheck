// Public-facing business/site configuration. Safe to import from client code:
// only reads NEXT_PUBLIC_* vars, with placeholder defaults so pages render
// before real details are filled in. Update the defaults or set the env vars.

export const site = {
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME || "Apexcheck Medical",
  tagline:
    process.env.NEXT_PUBLIC_BUSINESS_TAGLINE ||
    "Certified medical devices & supplies for clinics, hospitals, and home care.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  // Home market is Nigeria (NGN); GHS is shown only to visitors detected in
  // Ghana — see resolveVisitorCurrency() in @/lib/currency.
  currency: "NGN",

  // Digits only, international format without "+" — used to build wa.me links.
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "234200000000",

  // Online-only business — no physical address/showroom to surface.
  contact: {
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+234 20 000 0000",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "sales@apexcheck.local",
  },

  // Trust & compliance details surfaced on the site (placeholder until verified).
  compliance: {
    yearsInOperation: process.env.NEXT_PUBLIC_YEARS_IN_OPERATION || "",
  },

  // Free-form; shown on trust/policy pages.
  paymentMethods: ["Bank transfer", "Card payment", "Cash on delivery"],
  deliveryCoverage:
    process.env.NEXT_PUBLIC_DELIVERY_COVERAGE ||
    "Nationwide delivery across Nigeria. International supply on request.",
};

export function waLink(message: string, phone: string = site.whatsappNumber): string {
  const digits = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
