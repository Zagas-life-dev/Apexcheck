import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsOfUsePage() {
  return (
    <LegalPage title="Terms of Use">
      <p>
        These Terms of Use apply to your use of the {site.name} website. By using this site you
        agree to them.
      </p>
      <h2>Use of the site</h2>
      <ul>
        <li>The site and its content are provided for information and enquiry purposes.</li>
        <li>You agree not to misuse the site or attempt to disrupt its operation.</li>
      </ul>
      <h2>Product information</h2>
      <p>
        Information on this site does not constitute medical advice. Always consult the
        manufacturer&apos;s documentation and a qualified professional before purchasing or using a
        medical device.
      </p>
      <h2>Intellectual property</h2>
      <p>
        Brand names, product images and datasheets remain the property of their respective owners.
        Site content may not be copied or redistributed without permission.
      </p>
      <h2>Enquiries &amp; data</h2>
      <p>
        Details you submit through inquiry forms are used solely to respond to your request and
        manage your order. We do not sell your personal information.
      </p>
      <h2>Changes</h2>
      <p>
        We may update these Terms of Use from time to time. Continued use of the site constitutes
        acceptance of the current version.
      </p>
    </LegalPage>
  );
}
