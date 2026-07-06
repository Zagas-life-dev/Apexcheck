import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Import Policy" };

export default function ImportPolicyPage() {
  return (
    <LegalPage title="Import Policy">
      <p>
        {site.name} sources and imports medical devices and supplies in accordance with
        applicable national regulatory requirements and international standards. This policy
        explains how imported products are handled.
      </p>
      <h2>Regulatory compliance</h2>
      <p>
        Where required, imported devices carry appropriate conformity marks (e.g. CE marking)
        and manufacturer documentation, and are registered with the relevant regulatory
        authorities. Registration numbers are shown on product pages where available.
      </p>
      <h2>Import-on-request items</h2>
      <ul>
        <li>Certain high-value or specialised devices are imported to order.</li>
        <li>These items may require full or partial payment before an order is placed.</li>
        <li>Indicative lead times are shown on the product page and confirmed at quotation.</li>
      </ul>
      <h2>Duties, taxes and clearance</h2>
      <p>
        Unless stated otherwise in a written quotation, prices are inclusive of standard import
        duties and clearance for delivery within our coverage area. Special handling or expedited
        clearance may attract additional charges, communicated in advance.
      </p>
      <h2>Inspection</h2>
      <p>
        Imported goods are inspected on arrival. Any item found to be damaged or non-conforming
        is withheld from sale pending resolution with the manufacturer or supplier.
      </p>
    </LegalPage>
  );
}
