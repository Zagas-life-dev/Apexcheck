import type { EventType } from "@/lib/constants";

const SESSION_KEY = "apx_sid";

// Stable per-browser session id (used to estimate unique visitors).
export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

// Best-effort, non-blocking event tracking. Never throws.
export function trackEvent(type: EventType, opts: { itemId?: string } = {}): void {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({
    type,
    itemId: opts.itemId,
    page: window.location.pathname,
    referrer: document.referrer || undefined,
    sessionId: getSessionId(),
  });
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      if (navigator.sendBeacon("/api/events", blob)) return;
    }
  } catch {
    /* fall through to fetch */
  }
  fetch("/api/events", {
    method: "POST",
    body: payload,
    headers: { "Content-Type": "application/json" },
    keepalive: true,
  }).catch(() => {});
}
