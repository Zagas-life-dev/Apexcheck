"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type BuyerType = "business" | "personal";

export function InquiryForm({
  itemId,
  itemTitle,
  onSuccess,
  compact,
}: {
  itemId?: string;
  itemTitle?: string;
  onSuccess?: () => void;
  compact?: boolean;
}) {
  const [buyerType, setBuyerType] = useState<BuyerType>("business");
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    contactInfo: "",
    quantity: "",
    deliveryLocation: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        itemId,
        buyerType,
        companyName: buyerType === "business" ? form.companyName : undefined,
        contactName: form.contactName,
        contactInfo: form.contactInfo,
        quantity: form.quantity ? Number(form.quantity) : undefined,
        deliveryLocation: form.deliveryLocation || undefined,
        notes: form.notes || undefined,
      };
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setDone(true);
        toast.success("Inquiry sent — we'll be in touch shortly.");
        onSuccess?.();
      } else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Failed to send inquiry");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-8 text-center">
        <CheckCircle2Icon className="size-10 text-emerald-600" />
        <div>
          <p className="font-medium">Thank you!</p>
          <p className="text-sm text-muted-foreground">
            Your inquiry has been received. We&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {itemTitle ? (
        <div className="rounded-lg bg-muted p-2.5 text-sm">
          Regarding: <span className="font-medium">{itemTitle}</span>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-1 rounded-lg border p-1">
        {(["business", "personal"] as BuyerType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setBuyerType(t)}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors",
              buyerType === t
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {t === "business" ? "Business / Clinic" : "Personal use"}
          </button>
        ))}
      </div>

      {buyerType === "business" ? (
        <div className="space-y-1.5">
          <Label htmlFor="companyName">Company / clinic name *</Label>
          <Input
            id="companyName"
            required
            value={form.companyName}
            onChange={(e) => set("companyName", e.target.value)}
          />
        </div>
      ) : null}

      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <div className="space-y-1.5">
          <Label htmlFor="contactName">Your name *</Label>
          <Input
            id="contactName"
            required
            value={form.contactName}
            onChange={(e) => set("contactName", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contactInfo">Phone / WhatsApp / Email *</Label>
          <Input
            id="contactInfo"
            required
            placeholder="e.g. 024 000 0000"
            value={form.contactInfo}
            onChange={(e) => set("contactInfo", e.target.value)}
          />
        </div>
      </div>

      {buyerType === "business" ? (
        <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
          <div className="space-y-1.5">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => set("quantity", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="deliveryLocation">Delivery location</Label>
            <Input
              id="deliveryLocation"
              value={form.deliveryLocation}
              onChange={(e) => set("deliveryLocation", e.target.value)}
            />
          </div>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          rows={3}
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Any details about your requirements…"
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? <Loader2Icon className="animate-spin" /> : null}
        Send inquiry
      </Button>
    </form>
  );
}
