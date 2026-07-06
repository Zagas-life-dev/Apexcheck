import "server-only";
import { cache } from "react";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Item, type ItemDoc } from "@/models/Item";
import { serialize, type SerializedItem } from "@/lib/types";
import { CATEGORY_VALUES, type CategoryValue } from "@/lib/constants";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getPublishedItems(
  opts: { q?: string; category?: string; limit?: number } = {}
): Promise<SerializedItem[]> {
  await connectToDatabase();
  const filter: mongoose.QueryFilter<ItemDoc> = { published: true };

  if (opts.category && CATEGORY_VALUES.includes(opts.category as CategoryValue)) {
    filter.category = opts.category as CategoryValue;
  }
  if (opts.q && opts.q.trim()) {
    const rx = new RegExp(escapeRegex(opts.q.trim()), "i");
    filter.$or = [{ title: rx }, { description: rx }, { brand: rx }, { model: rx }];
  }

  let query = Item.find(filter).sort({ createdAt: -1 });
  if (opts.limit) query = query.limit(opts.limit);
  const rows = await query.lean();
  return serialize<SerializedItem[]>(rows);
}

export const getPublishedItemById = cache(
  async (id: string): Promise<SerializedItem | null> => {
    if (!mongoose.isValidObjectId(id)) return null;
    await connectToDatabase();
    const row = await Item.findOne({ _id: id, published: true }).lean();
    return row ? serialize<SerializedItem>(row) : null;
  }
);
