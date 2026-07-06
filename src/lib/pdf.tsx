import "server-only";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { site } from "@/lib/site";
import { categoryLabel, stockStatusLabel } from "@/lib/constants";
import type { SerializedItem } from "@/lib/types";

// PDF-safe currency (Helvetica lacks the ₵ glyph) — use the ISO code.
function money(amount?: number | null): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  return `${site.currency} ${amount.toLocaleString("en-GH")}`;
}

const BRAND = "#0f766e"; // teal-700

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, color: "#1e293b", fontFamily: "Helvetica" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderBottomColor: BRAND,
    paddingBottom: 10,
    marginBottom: 16,
  },
  brand: { fontSize: 16, fontFamily: "Helvetica-Bold", color: BRAND },
  tagline: { fontSize: 8, color: "#64748b", marginTop: 2, maxWidth: 260 },
  contact: { fontSize: 8, color: "#64748b", textAlign: "right" },
  title: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  subtitle: { fontSize: 10, color: "#64748b", marginBottom: 10 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: BRAND,
    marginTop: 14,
    marginBottom: 6,
  },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e2e8f0", paddingVertical: 4 },
  cellLabel: { width: "35%", color: "#64748b" },
  cellValue: { width: "65%" },
  priceBox: {
    backgroundColor: "#f1f5f9",
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
    marginBottom: 4,
  },
  priceBig: { fontSize: 16, fontFamily: "Helvetica-Bold" },
  chip: {
    fontSize: 8,
    color: BRAND,
    borderWidth: 1,
    borderColor: BRAND,
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap" },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 6,
    fontSize: 7,
    color: "#94a3b8",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  catItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

function Header() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.brand}>{site.name}</Text>
        <Text style={styles.tagline}>{site.tagline}</Text>
      </View>
      <View>
        <Text style={styles.contact}>{site.contact.phone}</Text>
        <Text style={styles.contact}>{site.contact.email}</Text>
        <Text style={styles.contact}>{site.url.replace(/^https?:\/\//, "")}</Text>
      </View>
    </View>
  );
}

function Footer() {
  return (
    <View style={styles.footer} fixed>
      <Text>Prices subject to change. Generated {new Date().toLocaleDateString("en-GB")}</Text>
    </View>
  );
}

function ItemSheet({ item }: { item: SerializedItem }) {
  return (
    <Document title={`${item.title} — Spec Sheet`}>
      <Page size="A4" style={styles.page}>
        <Header />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>
          {[categoryLabel(item.category), item.brand, item.model].filter(Boolean).join("  ·  ")}
        </Text>

        <View style={styles.priceBox}>
          {item.retailPrice != null ? (
            <>
              <Text style={{ fontSize: 8, color: "#64748b" }}>Retail price</Text>
              <Text style={styles.priceBig}>{money(item.retailPrice)}</Text>
            </>
          ) : (
            <Text style={styles.priceBig}>Contact us for pricing</Text>
          )}
          <Text style={{ fontSize: 8, color: "#64748b", marginTop: 4 }}>
            Stock: {stockStatusLabel(item.stockStatus)}
            {item.stockStatus === "preorder" && item.leadTime ? `  ·  Lead time: ${item.leadTime}` : ""}
          </Text>
        </View>

        {item.pricingTiers.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Bulk / B2B pricing</Text>
            {[...item.pricingTiers]
              .sort((a, b) => a.minQty - b.minQty)
              .map((t, i) => (
                <View key={i} style={styles.row}>
                  <Text style={styles.cellLabel}>{t.minQty}+ units</Text>
                  <Text style={styles.cellValue}>{money(t.unitPrice)}</Text>
                </View>
              ))}
          </>
        ) : null}

        {item.description ? (
          <>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={{ lineHeight: 1.4 }}>{item.description}</Text>
          </>
        ) : null}

        {item.specs.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Specifications</Text>
            {item.specs.map((s, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.cellLabel}>{s.label}</Text>
                <Text style={styles.cellValue}>{s.value}</Text>
              </View>
            ))}
          </>
        ) : null}

        {item.certifications.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <View style={styles.chipRow}>
              {item.certifications.map((c, i) => (
                <Text key={i} style={styles.chip}>
                  {c.name}
                  {c.number ? ` (${c.number})` : ""}
                </Text>
              ))}
            </View>
          </>
        ) : null}

        {item.warranty ? (
          <>
            <Text style={styles.sectionTitle}>Warranty</Text>
            <Text>{item.warranty}</Text>
          </>
        ) : null}

        <Footer />
      </Page>
    </Document>
  );
}

function Catalog({ items }: { items: SerializedItem[] }) {
  return (
    <Document title={`${site.name} — Catalog`}>
      <Page size="A4" style={styles.page}>
        <Header />
        <Text style={styles.title}>Product Catalog</Text>
        <Text style={styles.subtitle}>
          {items.length} products · {new Date().toLocaleDateString("en-GB")}
        </Text>

        {items.map((item) => (
          <View key={item._id} style={styles.catItem} wrap={false}>
            <View style={{ width: "70%" }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>{item.title}</Text>
              <Text style={{ fontSize: 8, color: "#64748b", marginTop: 1 }}>
                {[categoryLabel(item.category), item.brand, item.model]
                  .filter(Boolean)
                  .join("  ·  ")}
              </Text>
            </View>
            <View style={{ width: "30%", alignItems: "flex-end" }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>
                {item.retailPrice != null ? money(item.retailPrice) : "Enquire"}
              </Text>
              <Text style={{ fontSize: 8, color: "#64748b" }}>
                {stockStatusLabel(item.stockStatus)}
              </Text>
            </View>
          </View>
        ))}

        <Footer />
      </Page>
    </Document>
  );
}

export function renderItemSheet(item: SerializedItem): Promise<Buffer> {
  return renderToBuffer(<ItemSheet item={item} />);
}

export function renderCatalog(items: SerializedItem[]): Promise<Buffer> {
  return renderToBuffer(<Catalog items={items} />);
}
