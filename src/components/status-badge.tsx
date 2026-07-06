import * as React from "react";
import { cn } from "@/lib/utils";
import {
  stockStatusLabel,
  inquiryStatusLabel,
  paymentStatusLabel,
} from "@/lib/constants";

type Tone = "green" | "amber" | "red" | "slate" | "blue" | "teal";

const toneClasses: Record<Tone, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  amber: "bg-amber-50 text-amber-800 ring-amber-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  slate: "bg-slate-100 text-slate-600 ring-slate-500/20",
  blue: "bg-sky-50 text-sky-700 ring-sky-600/20",
  teal: "bg-teal-50 text-teal-700 ring-teal-600/20",
};

export function Pill({
  tone = "slate",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const stockTone: Record<string, Tone> = {
  in_stock: "green",
  out_of_stock: "red",
  preorder: "amber",
};
export function StockBadge({ status }: { status?: string }) {
  return <Pill tone={stockTone[status ?? ""] ?? "slate"}>{stockStatusLabel(status)}</Pill>;
}

const inquiryTone: Record<string, Tone> = {
  new: "blue",
  contacted: "amber",
  quoted: "teal",
  closed_won: "green",
  closed_lost: "slate",
};
export function InquiryStatusBadge({ status }: { status?: string }) {
  return <Pill tone={inquiryTone[status ?? ""] ?? "slate"}>{inquiryStatusLabel(status)}</Pill>;
}

const paymentTone: Record<string, Tone> = {
  unpaid: "red",
  mobilization_paid: "amber",
  fully_paid: "green",
};
export function PaymentBadge({ status }: { status?: string }) {
  return <Pill tone={paymentTone[status ?? ""] ?? "slate"}>{paymentStatusLabel(status)}</Pill>;
}
