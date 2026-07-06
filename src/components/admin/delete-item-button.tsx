"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2Icon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export function DeleteItemButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/items/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Item deleted");
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Failed to delete item");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setOpen(true)}
        aria-label="Delete item"
      >
        <Trash2Icon className="text-destructive" />
      </Button>
      <Modal open={open} onClose={() => !loading && setOpen(false)}>
        <h3 className="text-base font-medium">Delete item?</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{title}</span> will be permanently
          removed. This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={loading}>
            {loading ? <Loader2Icon className="animate-spin" /> : <Trash2Icon />}
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
