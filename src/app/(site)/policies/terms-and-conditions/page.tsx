import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsAndConditionsPage() {
  return (
    <LegalPage title="Terms & Conditions">
      <p>
        These Terms &amp; Conditions govern the sale of products and services by {site.name}. By
        placing an order you agree to these terms.
      </p>
      <h2>Products &amp; descriptions</h2>
      <p>
        We take care to describe products accurately, including specifications and certifications.
        Minor variations may occur; the manufacturer&apos;s official documentation prevails in case
        of discrepancy.
      </p>
      <h2>Pricing &amp; availability</h2>
      <ul>
        <li>Prices are indicative and may change without notice until confirmed in a quotation.</li>
        <li>Stock status is shown per item and confirmed at the time of order.</li>
      </ul>
      <h2>Warranty</h2>
      <p>
        Warranty terms are stated per product and are provided by the respective manufacturer.
        Warranty claims require proof of purchase and are subject to the manufacturer&apos;s
        assessment. Consumables and single-use items are not covered by warranty.
      </p>
      <h2>Delivery</h2>
      <p>
        {site.deliveryCoverage} Delivery timelines are estimates and may vary for import-on-request
        items.
      </p>
      <h2>Returns</h2>
      <ul>
        <li>Report any damage or discrepancy within 48 hours of delivery.</li>
        <li>Sterile, single-use and custom-imported items are non-returnable once supplied.</li>
      </ul>
      <h2>Liability</h2>
      <p>
        Devices must be used strictly in accordance with the manufacturer&apos;s instructions and
        by appropriately qualified personnel. {site.name} is not liable for misuse or use outside
        the intended purpose.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about these terms: {site.contact.email} · {site.contact.phone}.
      </p>
    </LegalPage>
  );
}
