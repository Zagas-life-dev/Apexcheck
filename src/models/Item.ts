import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";
import { CATEGORY_VALUES, STOCK_STATUS_VALUES } from "@/lib/constants";

const ImageSchema = new Schema(
  { url: { type: String, required: true }, publicId: { type: String } },
  { _id: false }
);

const SpecSchema = new Schema(
  { label: { type: String, required: true }, value: { type: String, required: true } },
  { _id: false }
);

const CertSchema = new Schema(
  {
    name: { type: String, required: true },
    number: { type: String },
    issuer: { type: String },
  },
  { _id: false }
);

const DocumentSchema = new Schema(
  { url: { type: String, required: true }, label: { type: String } },
  { _id: false }
);

const PricingTierSchema = new Schema(
  {
    minQty: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    unitPriceNGN: { type: Number },
  },
  { _id: false }
);

const ItemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, enum: CATEGORY_VALUES, index: true },
    brand: { type: String },
    model: { type: String },
    images: { type: [ImageSchema], default: [] },
    specs: { type: [SpecSchema], default: [] },
    certifications: { type: [CertSchema], default: [] },
    documents: { type: [DocumentSchema], default: [] },
    pricingTiers: { type: [PricingTierSchema], default: [] },
    retailPrice: { type: Number },
    retailPriceNGN: { type: Number },
    stockStatus: { type: String, enum: STOCK_STATUS_VALUES, default: "in_stock" },
    leadTime: { type: String },
    warranty: { type: String },
    requiresFullPayment: { type: Boolean, default: false },
    paystackReady: { type: Boolean, default: false },
    // Draft support: unpublished items are hidden from the public catalog.
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Text index powers catalog search across the most useful fields.
ItemSchema.index({ title: "text", description: "text", brand: "text", model: "text" });

export type ItemDoc = InferSchemaType<typeof ItemSchema>;

export const Item: Model<ItemDoc> =
  (models.Item as Model<ItemDoc>) || model<ItemDoc>("Item", ItemSchema);
