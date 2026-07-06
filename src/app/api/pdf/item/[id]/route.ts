import { type NextRequest } from "next/server";
import { getPublishedItemById } from "@/lib/items";
import { renderItemSheet } from "@/lib/pdf";

export const runtime = "nodejs";

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "item";
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const item = await getPublishedItemById(id);
  if (!item) return new Response("Not found", { status: 404 });

  const buffer = await renderItemSheet(item);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${slug(item.title)}-spec-sheet.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
