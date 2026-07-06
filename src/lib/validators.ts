import { z } from "zod";
import {
  CATEGORY_VALUES,
  STOCK_STATUS_VALUES,
  BUYER_TYPE_VALUES,
  INQUIRY_STATUS_VALUES,
  PAYMENT_STATUS_VALUES,
} from "@/lib/constants";

const asEnum = <T extends readonly [string, ...string[]]>(values: T) => z.enum(values);

const urlOrPath = z
  .string()
  .min(1)
  .refine((v) => /^https?:\/\//.test(v) || v.startsWith("/"), "Must be a URL or /path");

export const itemInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().optional().default(""),
  category: asEnum(CATEGORY_VALUES).optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  images: z
    .array(z.object({ url: urlOrPath, publicId: z.string().optional() }))
    .default([]),
  specs: z
    .array(z.object({ label: z.string().trim().min(1), value: z.string().trim().min(1) }))
    .default([]),
  certifications: z
    .array(
      z.object({
        name: z.string().trim().min(1),
        number: z.string().optional(),
        issuer: z.string().optional(),
      })
    )
    .default([]),
  documents: z
    .array(z.object({ url: urlOrPath, label: z.string().optional() }))
    .default([]),
  pricingTiers: z
    .array(
      z.object({
        minQty: z.coerce.number().int().positive(),
        unitPrice: z.coerce.number().nonnegative(),
        unitPriceNGN: z.coerce.number().nonnegative().optional(),
      })
    )
    .default([]),
  retailPrice: z.coerce.number().nonnegative().optional(),
  retailPriceNGN: z.coerce.number().nonnegative().optional(),
  stockStatus: asEnum(STOCK_STATUS_VALUES).default("in_stock"),
  leadTime: z.string().optional(),
  warranty: z.string().optional(),
  requiresFullPayment: z.boolean().default(false),
  paystackReady: z.boolean().default(false),
  published: z.boolean().default(true),
});

export type ItemInput = z.infer<typeof itemInputSchema>;

export const inquiryInputSchema = z
  .object({
    itemId: z.string().optional(),
    buyerType: asEnum(BUYER_TYPE_VALUES),
    companyName: z.string().optional(),
    contactName: z.string().trim().min(1, "Name is required"),
    contactInfo: z.string().trim().min(1, "Contact info is required"),
    quantity: z.coerce.number().int().positive().optional(),
    deliveryLocation: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine((v) => v.buyerType !== "business" || !!v.companyName?.trim(), {
    message: "Company name is required for business inquiries",
    path: ["companyName"],
  });

export type InquiryInput = z.infer<typeof inquiryInputSchema>;

export const inquiryUpdateSchema = z.object({
  status: asEnum(INQUIRY_STATUS_VALUES).optional(),
  paymentStatus: asEnum(PAYMENT_STATUS_VALUES).optional(),
});

export const eventInputSchema = z.object({
  type: z.enum(["page_view", "whatsapp_click", "interested_click", "pdf_download"]),
  itemId: z.string().optional(),
  page: z.string().optional(),
  referrer: z.string().optional(),
  sessionId: z.string().optional(),
});
