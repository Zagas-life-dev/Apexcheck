"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

// Fires a single page_view event on mount (optionally tied to an item).
export function PageViewTracker({ itemId }: { itemId?: string }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent("page_view", { itemId });
  }, [itemId]);
  return null;
}
