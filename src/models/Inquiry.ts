import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";
import {
  BUYER_TYPE_VALUES,
  INQUIRY_STATUS_VALUES,
  PAYMENT_STATUS_VALUES,
} from "@/lib/constants";

const InquirySchema = new Schema(
  {
    itemId: { type: Schema.Types.ObjectId, ref: "Item", index: true },
    // Denormalized so an inquiry stays readable even if the item is later deleted.
    itemTitle: { type: String },
    buyerType: { type: String, enum: BUYER_TYPE_VALUES, required: true },
    companyName: { type: String },
    contactName: { type: String, required: true },
    contactInfo: { type: String, required: true },
    quantity: { type: Number },
    deliveryLocation: { type: String },
    notes: { type: String },
    status: { type: String, enum: INQUIRY_STATUS_VALUES, default: "new", index: true },
    paymentStatus: { type: String, enum: PAYMENT_STATUS_VALUES, default: "unpaid" },
  },
  { timestamps: true }
);

export type InquiryDoc = InferSchemaType<typeof InquirySchema>;

export const Inquiry: Model<InquiryDoc> =
  (models.Inquiry as Model<InquiryDoc>) || model<InquiryDoc>("Inquiry", InquirySchema);
