import type { Metadata } from "next";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Item } from "@/models/Item";
import { serialize, type SerializedItem } from "@/lib/types";
import { ItemEditor } from "@/components/admin/item-editor";

export const metadata: Metadata = { title: "Edit item" };
export const dynamic = "force-dynamic";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();
  await connectToDatabase();
  const item = await Item.findById(id).lean();
  if (!item) notFound();
  const serialized = serialize<SerializedItem>(item);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Edit item</h1>
        <p className="text-sm text-muted-foreground">{serialized.title}</p>
      </div>
      <ItemEditor item={serialized} />
    </div>
  );
}
