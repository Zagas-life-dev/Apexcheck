import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";
import { EVENT_TYPES } from "@/lib/constants";

const EventSchema = new Schema(
  {
    type: { type: String, enum: EVENT_TYPES, required: true, index: true },
    itemId: { type: Schema.Types.ObjectId, ref: "Item", index: true },
    page: { type: String },
    referrer: { type: String },
    sessionId: { type: String, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type EventDoc = InferSchemaType<typeof EventSchema>;

export const Event: Model<EventDoc> =
  (models.Event as Model<EventDoc>) || model<EventDoc>("Event", EventSchema);
