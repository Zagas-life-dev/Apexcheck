// Plain, serialization-safe shapes for passing data from Server Components /
// API routes to Client Components (Mongoose docs are not serializable directly).

export interface ItemImage {
  url: string;
  publicId?: string;
}
export interface ItemSpec {
  label: string;
  value: string;
}
export interface ItemCert {
  name: string;
  number?: string;
  issuer?: string;
}
export interface ItemDocument {
  url: string;
  label?: string;
}
export interface PricingTier {
  minQty: number;
  unitPrice: number;
  unitPriceNGN?: number;
}

export interface SerializedItem {
  _id: string;
  title: string;
  description?: string;
  category: string;
  brand?: string;
  model?: string;
  images: ItemImage[];
  specs: ItemSpec[];
  certifications: ItemCert[];
  documents: ItemDocument[];
  pricingTiers: PricingTier[];
  retailPrice?: number;
  retailPriceNGN?: number;
  stockStatus: string;
  leadTime?: string;
  warranty?: string;
  requiresFullPayment: boolean;
  paystackReady: boolean;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SerializedInquiry {
  _id: string;
  itemId?: string;
  itemTitle?: string;
  buyerType: string;
  companyName?: string;
  contactName: string;
  contactInfo: string;
  quantity?: number;
  deliveryLocation?: string;
  notes?: string;
  status: string;
  paymentStatus: string;
  createdAt?: string;
  updatedAt?: string;
}

// Deep-clones a Mongoose doc / lean result into a plain JSON-safe object.
export function serialize<T>(value: unknown): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
