import "server-only";
import { env, isEmailConfigured } from "@/lib/env";
import { site } from "@/lib/site";
import { BUYER_TYPES } from "@/lib/constants";
import type { SerializedInquiry } from "@/lib/types";

const buyerTypeLabel = (v?: string) =>
  BUYER_TYPES.find((b) => b.value === v)?.label ?? v ?? "—";

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Sends via the Resend HTTP API when configured; otherwise logs (dev/no-op).
export async function sendEmail({ to, subject, html, text }: SendArgs): Promise<{ delivered: boolean }> {
  if (!isEmailConfigured()) {
    console.info(`[email] (not configured) would send "${subject}" to ${to}`);
    return { delivered: false };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.email.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: env.email.from, to, subject, html, text }),
    });
    if (!res.ok) {
      console.error("[email] Resend error:", res.status, await res.text());
      return { delivered: false };
    }
    return { delivered: true };
  } catch (e) {
    console.error("[email] send failed:", e);
    return { delivered: false };
  }
}

export async function notifyNewInquiry(inquiry: SerializedInquiry): Promise<void> {
  if (!env.email.adminNotify) {
    console.info("[email] no ADMIN_NOTIFICATION_EMAIL set; skipping inquiry notification");
    return;
  }
  const rows: [string, string | undefined][] = [
    ["Item", inquiry.itemTitle],
    ["Buyer type", inquiry.buyerType],
    ["Company", inquiry.companyName],
    ["Contact name", inquiry.contactName],
    ["Contact info", inquiry.contactInfo],
    ["Quantity", inquiry.quantity ? String(inquiry.quantity) : undefined],
    ["Delivery location", inquiry.deliveryLocation],
    ["Notes", inquiry.notes],
  ];
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px">
      <h2 style="margin:0 0 12px">New inquiry — ${site.name}</h2>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .filter(([, v]) => v)
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 12px;color:#64748b;vertical-align:top">${k}</td><td style="padding:6px 12px;font-weight:600">${v}</td></tr>`
          )
          .join("")}
      </table>
      <p style="margin-top:16px"><a href="${site.url}/admin/inquiries">Open in admin →</a></p>
    </div>`;
  const text = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  await sendEmail({
    to: env.email.adminNotify,
    subject: `New inquiry${inquiry.itemTitle ? `: ${inquiry.itemTitle}` : ""} (${buyerTypeLabel(
      inquiry.buyerType
    )})`,
    html,
    text,
  });
}
