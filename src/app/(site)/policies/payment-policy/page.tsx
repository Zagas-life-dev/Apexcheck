import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Payment Policy" };

export default function PaymentPolicyPage() {
  return (
    <LegalPage title="Payment Policy">
      <p>
        This policy sets out how payments are made for products and services from {site.name}.
      </p>
      <h2>Accepted payment methods</h2>
      <ul>
        {site.paymentMethods.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
      <h2>Quotations and orders</h2>
      <p>
        Prices shown online are indicative. A formal quotation is issued for bulk / B2B orders and
        confirms unit pricing, quantities, delivery and payment terms.
      </p>
      <h2>Mobilization and full payment</h2>
      <ul>
        <li>
          Standard stocked items may be reserved with a mobilization (part) payment, with the
          balance due before or on delivery.
        </li>
        <li>
          High-value, custom or import-on-request items may require full payment before the order
          is processed. Such items are clearly marked at quotation.
        </li>
        <li>An order proceeds to processing once the agreed payment has been confirmed.</li>
      </ul>
      <h2>Invoicing &amp; receipts</h2>
      <p>
        A receipt or invoice is issued for every confirmed payment. Please retain it for warranty
        and support purposes.
      </p>
      <h2>Refunds</h2>
      <p>
        Refund eligibility is governed by our Terms &amp; Conditions and the nature of the item
        (for example, sterile consumables and custom imports may be non-refundable).
      </p>
    </LegalPage>
  );
}
