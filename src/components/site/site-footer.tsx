import Link from "next/link";
import { PhoneIcon, MailIcon } from "lucide-react";
import { site } from "@/lib/site";
import { Logo } from "@/components/logo";

const policyLinks = [
  { href: "/policies/import-policy", label: "Import Policy" },
  { href: "/policies/payment-policy", label: "Payment Policy" },
  { href: "/policies/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/policies/terms-of-use", label: "Terms of Use" },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <Logo className="h-7 w-auto" />
            {site.name}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{site.tagline}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <PhoneIcon className="size-4 shrink-0" />
              <a href={`tel:${site.contact.phone}`} className="hover:text-foreground">
                {site.contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MailIcon className="size-4 shrink-0" />
              <a href={`mailto:${site.contact.email}`} className="hover:text-foreground">
                {site.contact.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Policies</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {policyLinks.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="hover:text-foreground">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Payments & delivery</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Payments: {site.paymentMethods.join(", ")}</li>
            <li className="text-xs">{site.deliveryCoverage}</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row">
          <span>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </span>
          <span>Medical devices supplied subject to applicable regulations.</span>
        </div>
      </div>
    </footer>
  );
}
