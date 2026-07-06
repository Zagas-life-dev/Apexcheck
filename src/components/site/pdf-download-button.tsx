"use client";

import { DownloadIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

export function PdfDownloadButton({
  href,
  itemId,
  label = "Download Spec Sheet (PDF)",
  className,
}: {
  href: string;
  itemId?: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackEvent("pdf_download", { itemId })}
      className={cn(buttonVariants({ variant: "outline", size: "sm" }), className)}
    >
      <DownloadIcon /> {label}
    </a>
  );
}
