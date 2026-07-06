"use client";

import Link from "next/link";
import { useState } from "react";
import { MenuIcon, XIcon, MessageCircleIcon } from "lucide-react";
import { site, waLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { Logo } from "@/components/logo";

const nav = [
  { href: "/", label: "Home" },
  { href: "/catalog", label: "Catalog" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const wa = waLink(`Hello ${site.name}, I have an enquiry.`);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Logo className="h-8 w-auto" priority />
          <span className="hidden sm:inline">{site.name}</span>
        </Link>
        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("whatsapp_click")}
            className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}
          >
            <MessageCircleIcon /> WhatsApp
          </a>
          <button
            className="grid size-9 place-items-center rounded-lg border md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                trackEvent("whatsapp_click");
                setOpen(false);
              }}
              className={cn(buttonVariants({ size: "sm" }), "mt-1 justify-center")}
            >
              <MessageCircleIcon /> Chat on WhatsApp
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
