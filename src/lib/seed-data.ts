import { Item } from "@/models/Item";

// Placeholder imagery via placehold.co (allowed in next.config remotePatterns).
// Real photos are added later through the admin editor (Cloudinary uploads).
const img = (label: string) =>
  `https://placehold.co/800x600/e2e8f0/1e293b?text=${encodeURIComponent(label)}`;

// Sample catalog — one device per category. Swap for the real Word-doc catalog
// via `npm run seed` once MONGODB_URI points at a real database.
export const sampleItems = [
  {
    title: "Omron M3 Digital Blood Pressure Monitor",
    description:
      "Upper-arm automatic blood pressure monitor with IntelliSense technology for accurate, comfortable one-touch readings. Clinically validated for home and clinic use.",
    category: "diagnostic",
    brand: "Omron",
    model: "M3 (HEM-7154)",
    images: [{ url: img("BP Monitor") }],
    specs: [
      { label: "Measurement range", value: "0–299 mmHg" },
      { label: "Cuff size", value: "22–42 cm" },
      { label: "Memory", value: "60 readings" },
      { label: "Power", value: "4 × AA / AC adapter" },
    ],
    certifications: [
      { name: "CE Mark", number: "CE 0197", issuer: "European Conformity" },
      { name: "Ghana FDA", number: "FDA/MD/2023/0142", issuer: "Ghana FDA" },
    ],
    documents: [],
    pricingTiers: [
      { minQty: 5, unitPrice: 620 },
      { minQty: 20, unitPrice: 560 },
      { minQty: 50, unitPrice: 510 },
    ],
    retailPrice: 690,
    stockStatus: "in_stock",
    warranty: "1 year manufacturer warranty",
    requiresFullPayment: false,
    paystackReady: true,
    published: true,
  },
  {
    title: "Contec CMS8000 Patient Vital Signs Monitor",
    description:
      "Multi-parameter bedside monitor tracking ECG, SpO₂, NIBP, respiration and temperature on a bright 12.1\" display. Ideal for wards, theatres and ambulances.",
    category: "monitoring",
    brand: "Contec",
    model: "CMS8000",
    images: [{ url: img("Vitals Monitor") }],
    specs: [
      { label: "Parameters", value: "ECG, SpO₂, NIBP, RESP, TEMP" },
      { label: "Display", value: '12.1" TFT colour' },
      { label: "Battery", value: "Up to 2 hours" },
      { label: "Alarms", value: "Audible + visual, adjustable" },
    ],
    certifications: [
      { name: "CE Mark", number: "CE 1639", issuer: "European Conformity" },
      { name: "ISO 13485", issuer: "ISO" },
    ],
    documents: [],
    pricingTiers: [
      { minQty: 3, unitPrice: 8200 },
      { minQty: 10, unitPrice: 7600 },
    ],
    retailPrice: 8900,
    stockStatus: "preorder",
    leadTime: "3–4 weeks",
    warranty: "2 year warranty",
    requiresFullPayment: true,
    paystackReady: false,
    published: true,
  },
  {
    title: "Foldable Steel Wheelchair (Standard)",
    description:
      "Durable powder-coated steel frame wheelchair with padded seat, swing-away footrests and puncture-proof rear tyres. Folds flat for easy transport and storage.",
    category: "mobility_aids",
    brand: "MediMove",
    model: "MM-909",
    images: [{ url: img("Wheelchair") }],
    specs: [
      { label: "Weight capacity", value: "120 kg" },
      { label: "Seat width", value: "46 cm" },
      { label: "Frame", value: "Powder-coated steel" },
      { label: "Folded width", value: "28 cm" },
    ],
    certifications: [
      { name: "CE Mark", issuer: "European Conformity" },
      { name: "Ghana FDA", number: "FDA/MD/2022/0781", issuer: "Ghana FDA" },
    ],
    documents: [],
    pricingTiers: [
      { minQty: 5, unitPrice: 1150 },
      { minQty: 15, unitPrice: 1040 },
    ],
    retailPrice: 1290,
    stockStatus: "in_stock",
    warranty: "6 month warranty on frame",
    requiresFullPayment: false,
    paystackReady: true,
    published: true,
  },
  {
    title: "Nitrile Examination Gloves — Powder Free (Box of 100)",
    description:
      "Ambidextrous, powder-free nitrile examination gloves. Latex-free, textured fingertips for grip, suitable for clinical and laboratory use. Available in S/M/L/XL.",
    category: "ppe",
    brand: "SafeTouch",
    model: "NX-100",
    images: [{ url: img("Nitrile Gloves") }],
    specs: [
      { label: "Material", value: "Nitrile (latex-free)" },
      { label: "Powder", value: "Powder-free" },
      { label: "Quantity", value: "100 gloves / box" },
      { label: "Sizes", value: "S, M, L, XL" },
    ],
    certifications: [
      { name: "CE Mark", number: "CE 2777", issuer: "European Conformity" },
      { name: "EN 455", issuer: "European Standard" },
    ],
    documents: [],
    pricingTiers: [
      { minQty: 10, unitPrice: 78 },
      { minQty: 50, unitPrice: 69 },
      { minQty: 200, unitPrice: 62 },
    ],
    retailPrice: 89,
    stockStatus: "in_stock",
    warranty: "",
    requiresFullPayment: false,
    paystackReady: true,
    published: true,
  },
  {
    title: "Disposable Syringes 5ml with Needle (Box of 100)",
    description:
      "Sterile, single-use 5ml Luer-slip syringes with 21G needles. Individually blister-packed, clear barrel with bold graduations. For single patient use only.",
    category: "consumables",
    brand: "MedLine",
    model: "SYR-5ML",
    images: [{ url: img("Syringes 5ml") }],
    specs: [
      { label: "Volume", value: "5 ml" },
      { label: "Needle", value: "21G × 1.5\"" },
      { label: "Sterility", value: "EO sterilised, single use" },
      { label: "Quantity", value: "100 / box" },
    ],
    certifications: [
      { name: "CE Mark", issuer: "European Conformity" },
      { name: "Ghana FDA", number: "FDA/MD/2023/0455", issuer: "Ghana FDA" },
    ],
    documents: [],
    pricingTiers: [
      { minQty: 20, unitPrice: 42 },
      { minQty: 100, unitPrice: 37 },
    ],
    retailPrice: 49,
    stockStatus: "in_stock",
    warranty: "",
    requiresFullPayment: false,
    paystackReady: true,
    published: true,
  },
  {
    title: "Semi-Automatic 3-Function Hospital Bed",
    description:
      "Adjustable hospital bed with manual crank controls for backrest, knee-rest and height. Includes side rails, IV pole holder and castors with brakes. Epoxy-coated steel.",
    category: "equipment",
    brand: "CarePro",
    model: "CB-3F",
    images: [{ url: img("Hospital Bed") }],
    specs: [
      { label: "Functions", value: "Backrest, knee-rest, height" },
      { label: "Weight capacity", value: "230 kg" },
      { label: "Side rails", value: "Collapsible aluminium" },
      { label: "Castors", value: '5" with brakes' },
    ],
    certifications: [
      { name: "CE Mark", issuer: "European Conformity" },
      { name: "ISO 13485", issuer: "ISO" },
    ],
    documents: [],
    pricingTiers: [
      { minQty: 3, unitPrice: 5400 },
      { minQty: 10, unitPrice: 4950 },
    ],
    retailPrice: 5900,
    stockStatus: "preorder",
    leadTime: "2–3 weeks",
    warranty: "1 year warranty",
    requiresFullPayment: true,
    paystackReady: false,
    published: true,
  },
] as const;

// Insert sample items only when the collection is empty (used for auto-seeding
// the ephemeral in-memory DB in local dev).
export async function ensureSeeded(): Promise<void> {
  const count = await Item.estimatedDocumentCount();
  if (count > 0) return;
  await Item.insertMany(sampleItems);
  console.warn(`[seed] inserted ${sampleItems.length} sample items`);
}

// Full (re)seed used by the standalone `npm run seed` script.
export async function seedDatabase({ reset = false } = {}): Promise<number> {
  if (reset) await Item.deleteMany({});
  const existing = await Item.estimatedDocumentCount();
  if (existing > 0 && !reset) return 0;
  await Item.insertMany(sampleItems);
  return sampleItems.length;
}
