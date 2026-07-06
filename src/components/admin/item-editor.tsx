"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  PlusIcon,
  Trash2Icon,
  UploadIcon,
  Loader2Icon,
  XIcon,
  FileTextIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { CATEGORIES, STOCK_STATUSES } from "@/lib/constants";
import type { SerializedItem } from "@/lib/types";

type TierRow = { minQty: string; unitPrice: string; unitPriceNGN: string };

type EditorState = {
  title: string;
  description: string;
  category: string;
  brand: string;
  model: string;
  images: { url: string; publicId?: string }[];
  specs: { label: string; value: string }[];
  certifications: { name: string; number?: string; issuer?: string }[];
  documents: { url: string; label?: string; publicId?: string }[];
  pricingTiers: TierRow[];
  retailPrice: string;
  retailPriceNGN: string;
  stockStatus: string;
  leadTime: string;
  warranty: string;
  requiresFullPayment: boolean;
  paystackReady: boolean;
  published: boolean;
};

function fromItem(item?: SerializedItem): EditorState {
  return {
    title: item?.title ?? "",
    description: item?.description ?? "",
    category: item?.category ?? "",
    brand: item?.brand ?? "",
    model: item?.model ?? "",
    images: item?.images ?? [],
    specs: item?.specs ?? [],
    certifications: item?.certifications ?? [],
    documents: item?.documents ?? [],
    pricingTiers:
      item?.pricingTiers?.map((t) => ({
        minQty: String(t.minQty),
        unitPrice: String(t.unitPrice),
        unitPriceNGN: t.unitPriceNGN != null ? String(t.unitPriceNGN) : "",
      })) ?? [],
    retailPrice: item?.retailPrice != null ? String(item.retailPrice) : "",
    retailPriceNGN: item?.retailPriceNGN != null ? String(item.retailPriceNGN) : "",
    stockStatus: item?.stockStatus ?? "in_stock",
    leadTime: item?.leadTime ?? "",
    warranty: item?.warranty ?? "",
    requiresFullPayment: item?.requiresFullPayment ?? false,
    paystackReady: item?.paystackReady ?? false,
    published: item?.published ?? true,
  };
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="font-medium">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function CheckboxRow({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 has-checked:border-primary/40 has-checked:bg-primary/5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 accent-primary"
      />
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
      </span>
    </label>
  );
}

export function ItemEditor({ item }: { item?: SerializedItem }) {
  const router = useRouter();
  const isEdit = Boolean(item?._id);
  const [state, setState] = useState<EditorState>(() => fromItem(item));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = <K extends keyof EditorState>(key: K, value: EditorState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  async function uploadFiles(files: FileList | null, kind: "image" | "document") {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        form.append("kind", kind);
        const res = await fetch("/api/admin/upload", { method: "POST", body: form });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          toast.error(data.error || `Failed to upload ${file.name}`);
          continue;
        }
        const stored = (await res.json()) as { url: string; publicId?: string };
        if (kind === "image") {
          setState((s) => ({ ...s, images: [...s.images, stored] }));
        } else {
          setState((s) => ({
            ...s,
            documents: [...s.documents, { url: stored.url, publicId: stored.publicId, label: file.name }],
          }));
        }
      }
    } finally {
      setUploading(false);
    }
  }

  function buildPayload() {
    return {
      title: state.title.trim(),
      description: state.description,
      category: state.category || undefined,
      brand: state.brand || undefined,
      model: state.model || undefined,
      images: state.images,
      specs: state.specs.filter((s) => s.label.trim() && s.value.trim()),
      certifications: state.certifications.filter((c) => c.name.trim()),
      documents: state.documents
        .filter((d) => d.url.trim())
        .map((d) => ({ url: d.url, label: d.label })),
      pricingTiers: state.pricingTiers
        .filter((t) => t.minQty !== "" && t.unitPrice !== "")
        .map((t) => ({
          minQty: Number(t.minQty),
          unitPrice: Number(t.unitPrice),
          unitPriceNGN: t.unitPriceNGN === "" ? undefined : Number(t.unitPriceNGN),
        })),
      retailPrice: state.retailPrice === "" ? undefined : Number(state.retailPrice),
      retailPriceNGN: state.retailPriceNGN === "" ? undefined : Number(state.retailPriceNGN),
      stockStatus: state.stockStatus,
      leadTime: state.leadTime || undefined,
      warranty: state.warranty || undefined,
      requiresFullPayment: state.requiresFullPayment,
      paystackReady: state.paystackReady,
      published: state.published,
    };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(
        isEdit ? `/api/admin/items/${item!._id}` : "/api/admin/items",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload()),
        }
      );
      if (res.ok) {
        toast.success(isEdit ? "Item updated" : "Item created");
        router.push("/admin/items");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Failed to save item");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 pb-24">
      <Section title="Basics">
        <div className="grid gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={state.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Omron M3 Digital Blood Pressure Monitor"
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <NativeSelect
                id="category"
                value={state.category}
                onChange={(e) => set("category", e.target.value)}
              >
                <option value="">— Select —</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" value={state.brand} onChange={(e) => set("brand", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="model">Model</Label>
              <Input id="model" value={state.model} onChange={(e) => set("model", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              value={state.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Short marketing + clinical description of the device."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="stockStatus">Stock status</Label>
              <NativeSelect
                id="stockStatus"
                value={state.stockStatus}
                onChange={(e) => set("stockStatus", e.target.value)}
              >
                {STOCK_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="leadTime">Lead time (if preorder)</Label>
              <Input
                id="leadTime"
                value={state.leadTime}
                onChange={(e) => set("leadTime", e.target.value)}
                placeholder="e.g. 2–3 weeks"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="warranty">Warranty</Label>
              <Input
                id="warranty"
                value={state.warranty}
                onChange={(e) => set("warranty", e.target.value)}
                placeholder="e.g. 1 year manufacturer warranty"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Photos" description="First image is used as the main/thumbnail image.">
        <div className="flex flex-wrap gap-3">
          {state.images.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <div key={i} className="group relative size-28 overflow-hidden rounded-lg border">
              <img src={img.url} alt="" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => set("images", state.images.filter((_, j) => j !== i))}
                className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-destructive opacity-0 shadow transition group-hover:opacity-100"
                aria-label="Remove image"
              >
                <XIcon className="size-3.5" />
              </button>
              {i === 0 ? (
                <span className="absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                  Main
                </span>
              ) : null}
            </div>
          ))}
          <label className="flex size-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-muted-foreground hover:bg-muted">
            {uploading ? (
              <Loader2Icon className="size-5 animate-spin" />
            ) : (
              <UploadIcon className="size-5" />
            )}
            <span className="text-xs">Upload</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                uploadFiles(e.target.files, "image");
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </Section>

      <Section title="Specifications" description="Shown as a clean table on the product page.">
        <RepeatableRows
          rows={state.specs}
          onChange={(rows) => set("specs", rows)}
          empty={{ label: "", value: "" }}
          addLabel="Add specification"
          render={(row, update) => (
            <>
              <Input
                placeholder="Label (e.g. Weight capacity)"
                value={row.label}
                onChange={(e) => update({ ...row, label: e.target.value })}
              />
              <Input
                placeholder="Value (e.g. 120 kg)"
                value={row.value}
                onChange={(e) => update({ ...row, value: e.target.value })}
              />
            </>
          )}
        />
      </Section>

      <Section title="Certifications" description="Trust signals shown prominently to buyers.">
        <RepeatableRows
          rows={state.certifications}
          onChange={(rows) => set("certifications", rows)}
          empty={{ name: "", number: "", issuer: "" }}
          addLabel="Add certification"
          render={(row, update) => (
            <>
              <Input
                placeholder="Name (e.g. CE Mark)"
                value={row.name}
                onChange={(e) => update({ ...row, name: e.target.value })}
              />
              <Input
                placeholder="Number (optional)"
                value={row.number ?? ""}
                onChange={(e) => update({ ...row, number: e.target.value })}
              />
              <Input
                placeholder="Issuer (optional)"
                value={row.issuer ?? ""}
                onChange={(e) => update({ ...row, issuer: e.target.value })}
              />
            </>
          )}
        />
      </Section>

      <Section title="Documents" description="Datasheets, manuals — offered as downloads.">
        <div className="space-y-2">
          {state.documents.map((doc, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border p-2">
              <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
              <Input
                className="flex-1"
                placeholder="Label"
                value={doc.label ?? ""}
                onChange={(e) => {
                  const documents = [...state.documents];
                  documents[i] = { ...doc, label: e.target.value };
                  set("documents", documents);
                }}
              />
              <a
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="max-w-[30%] truncate text-xs text-muted-foreground hover:underline"
              >
                {doc.url.split("/").pop()}
              </a>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => set("documents", state.documents.filter((_, j) => j !== i))}
              >
                <Trash2Icon className="text-destructive" />
              </Button>
            </div>
          ))}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
            {uploading ? <Loader2Icon className="size-4 animate-spin" /> : <UploadIcon className="size-4" />}
            Upload document
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                uploadFiles(e.target.files, "document");
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </Section>

      <Section
        title="Pricing"
        description="Retail (B2C) price and optional B2B bulk tiers, in NGN and GHS. Leave GHS blank if not yet known — buyers detected in Ghana will see “Contact us for pricing” until it's filled in."
      >
        <div className="grid gap-4">
          <div className="grid max-w-md gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="retailPriceNGN">Retail price (NGN)</Label>
              <Input
                id="retailPriceNGN"
                type="number"
                min="0"
                value={state.retailPriceNGN}
                onChange={(e) => set("retailPriceNGN", e.target.value)}
                placeholder="e.g. 850000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="retailPrice">Retail price (GHS)</Label>
              <Input
                id="retailPrice"
                type="number"
                min="0"
                value={state.retailPrice}
                onChange={(e) => set("retailPrice", e.target.value)}
                placeholder="e.g. 690"
              />
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Bulk pricing tiers</Label>
            <RepeatableRows
              rows={state.pricingTiers}
              onChange={(rows) => set("pricingTiers", rows)}
              empty={{ minQty: "", unitPrice: "", unitPriceNGN: "" }}
              addLabel="Add tier"
              render={(row, update) => (
                <>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Min qty"
                    value={row.minQty}
                    onChange={(e) => update({ ...row, minQty: e.target.value })}
                  />
                  <Input
                    type="number"
                    min="0"
                    placeholder="Unit price (NGN)"
                    value={row.unitPriceNGN}
                    onChange={(e) => update({ ...row, unitPriceNGN: e.target.value })}
                  />
                  <Input
                    type="number"
                    min="0"
                    placeholder="Unit price (GHS)"
                    value={row.unitPrice}
                    onChange={(e) => update({ ...row, unitPrice: e.target.value })}
                  />
                </>
              )}
            />
          </div>
        </div>
      </Section>

      <Section title="Flags & visibility">
        <div className="grid gap-3 sm:grid-cols-3">
          <CheckboxRow
            checked={state.published}
            onChange={(v) => set("published", v)}
            label="Published"
            hint="Visible in the public catalog"
          />
          <CheckboxRow
            checked={state.requiresFullPayment}
            onChange={(v) => set("requiresFullPayment", v)}
            label="Requires full payment"
            hint="High-value / custom items"
          />
          <CheckboxRow
            checked={state.paystackReady}
            onChange={(v) => set("paystackReady", v)}
            label="Paystack ready"
            hint="Scaffold flag (not live)"
          />
        </div>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-2 px-4 py-3">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/items")}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving || uploading}>
            {saving ? <Loader2Icon className="animate-spin" /> : null}
            {isEdit ? "Save changes" : "Create item"}
          </Button>
        </div>
      </div>
    </form>
  );
}

// Generic repeatable field-group with add/remove.
function RepeatableRows<T>({
  rows,
  onChange,
  empty,
  addLabel,
  render,
}: {
  rows: T[];
  onChange: (rows: T[]) => void;
  empty: T;
  addLabel: string;
  render: (row: T, update: (next: T) => void) => React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="grid flex-1 gap-2 sm:grid-cols-2 [&:has(>*:nth-child(3))]:sm:grid-cols-3">
            {render(row, (next) => {
              const copy = [...rows];
              copy[i] = next;
              onChange(copy);
            })}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="mt-0.5"
            onClick={() => onChange(rows.filter((_, j) => j !== i))}
            aria-label="Remove"
          >
            <Trash2Icon className="text-destructive" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...rows, empty])}>
        <PlusIcon /> {addLabel}
      </Button>
    </div>
  );
}
