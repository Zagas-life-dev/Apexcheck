import { getPublishedItems } from "@/lib/items";
import { renderCatalog } from "@/lib/pdf";

export const runtime = "nodejs";

export async function GET() {
  const items = await getPublishedItems();
  const buffer = await renderCatalog(items);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="apexcheck-catalog.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
