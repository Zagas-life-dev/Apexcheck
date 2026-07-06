"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { NativeSelect } from "@/components/ui/native-select";
import { INQUIRY_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";

export function InquiryStatusControls({
  id,
  status,
  paymentStatus,
}: {
  id: string;
  status: string;
  paymentStatus: string;
}) {
  const router = useRouter();
  const [s, setS] = useState(status);
  const [p, setP] = useState(paymentStatus);
  const [saving, setSaving] = useState(false);

  async function update(patch: Record<string, string>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        toast.success("Updated");
        router.refresh();
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Status</label>
        <NativeSelect
          className="h-8 min-w-[150px]"
          value={s}
          disabled={saving}
          onChange={(e) => {
            setS(e.target.value);
            update({ status: e.target.value });
          }}
        >
          {INQUIRY_STATUSES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </NativeSelect>
      </div>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Payment</label>
        <NativeSelect
          className="h-8 min-w-[170px]"
          value={p}
          disabled={saving}
          onChange={(e) => {
            setP(e.target.value);
            update({ paymentStatus: e.target.value });
          }}
        >
          {PAYMENT_STATUSES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </NativeSelect>
      </div>
    </div>
  );
}
