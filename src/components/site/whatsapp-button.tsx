"use client";

import { MessageCircleIcon } from "lucide-react";
import { waLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

type Variant = "default" | "outline" | "secondary" | "ghost";
type Size = "default" | "sm" | "lg";

export function WhatsAppButton({
  message,
  itemId,
  label = "Chat on WhatsApp",
  variant = "default",
  size = "lg",
  className,
}: {
  message: string;
  itemId?: string;
  label?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackEvent("whatsapp_click", { itemId })}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      <MessageCircleIcon /> {label}
    </a>
  );
}
