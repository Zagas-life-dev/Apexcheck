"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ItemImage } from "@/lib/types";

export function ProductGallery({
  images,
  title,
}: {
  images: ItemImage[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl border bg-muted text-muted-foreground">
        <ImageIcon className="size-10" />
      </div>
    );
  }

  const current = images[Math.min(active, images.length - 1)];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
        <Image
          src={current.url}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 40vw"
        />
      </div>
      {images.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative size-16 overflow-hidden rounded-lg border transition",
                i === active ? "ring-2 ring-primary ring-offset-1" : "opacity-70 hover:opacity-100"
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={img.url} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
