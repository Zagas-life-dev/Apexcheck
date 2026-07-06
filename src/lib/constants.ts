// Canonical enums + display labels shared across models, admin, and public UI.
// Values are literal tuples so Zod + Mongoose infer proper union types.

export const CATEGORY_VALUES = [
  "diagnostic",
  "monitoring",
  "mobility_aids",
  "ppe",
  "consumables",
  "equipment",
] as const;
export type CategoryValue = (typeof CATEGORY_VALUES)[number];
const CATEGORY_LABELS: Record<CategoryValue, string> = {
  diagnostic: "Diagnostic",
  monitoring: "Monitoring",
  mobility_aids: "Mobility Aids",
  ppe: "PPE",
  consumables: "Consumables",
  equipment: "Equipment",
};
export const CATEGORIES = CATEGORY_VALUES.map((value) => ({
  value,
  label: CATEGORY_LABELS[value],
}));
export const categoryLabel = (v?: string): string =>
  v && v in CATEGORY_LABELS ? CATEGORY_LABELS[v as CategoryValue] : v ?? "—";

export const STOCK_STATUS_VALUES = ["in_stock", "out_of_stock", "preorder"] as const;
export type StockStatus = (typeof STOCK_STATUS_VALUES)[number];
const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  in_stock: "In stock",
  out_of_stock: "Out of stock",
  preorder: "Preorder",
};
export const STOCK_STATUSES = STOCK_STATUS_VALUES.map((value) => ({
  value,
  label: STOCK_STATUS_LABELS[value],
}));
export const stockStatusLabel = (v?: string): string =>
  v && v in STOCK_STATUS_LABELS ? STOCK_STATUS_LABELS[v as StockStatus] : v ?? "—";

export const BUYER_TYPE_VALUES = ["business", "personal"] as const;
export type BuyerType = (typeof BUYER_TYPE_VALUES)[number];
const BUYER_TYPE_LABELS: Record<BuyerType, string> = {
  business: "Business / Clinic",
  personal: "Personal use",
};
export const BUYER_TYPES = BUYER_TYPE_VALUES.map((value) => ({
  value,
  label: BUYER_TYPE_LABELS[value],
}));

export const INQUIRY_STATUS_VALUES = [
  "new",
  "contacted",
  "quoted",
  "closed_won",
  "closed_lost",
] as const;
export type InquiryStatus = (typeof INQUIRY_STATUS_VALUES)[number];
const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  closed_won: "Closed — Won",
  closed_lost: "Closed — Lost",
};
export const INQUIRY_STATUSES = INQUIRY_STATUS_VALUES.map((value) => ({
  value,
  label: INQUIRY_STATUS_LABELS[value],
}));
export const inquiryStatusLabel = (v?: string): string =>
  v && v in INQUIRY_STATUS_LABELS ? INQUIRY_STATUS_LABELS[v as InquiryStatus] : v ?? "—";

export const PAYMENT_STATUS_VALUES = ["unpaid", "mobilization_paid", "fully_paid"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUS_VALUES)[number];
const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  mobilization_paid: "Mobilization paid",
  fully_paid: "Fully paid",
};
export const PAYMENT_STATUSES = PAYMENT_STATUS_VALUES.map((value) => ({
  value,
  label: PAYMENT_STATUS_LABELS[value],
}));
export const paymentStatusLabel = (v?: string): string =>
  v && v in PAYMENT_STATUS_LABELS ? PAYMENT_STATUS_LABELS[v as PaymentStatus] : v ?? "—";

export const EVENT_TYPES = [
  "page_view",
  "whatsapp_click",
  "interested_click",
  "pdf_download",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];
