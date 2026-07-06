import type { Metadata } from "next";
import { ItemEditor } from "@/components/admin/item-editor";

export const metadata: Metadata = { title: "New item" };

export default function NewItemPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">New item</h1>
        <p className="text-sm text-muted-foreground">Add a product to your catalog.</p>
      </div>
      <ItemEditor />
    </div>
  );
}
