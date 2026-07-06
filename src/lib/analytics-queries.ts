import "server-only";
import { connectToDatabase } from "@/lib/db";
import { Item } from "@/models/Item";
import { Inquiry } from "@/models/Inquiry";
import { Event } from "@/models/Event";

export interface DashboardStats {
  items: number;
  publishedItems: number;
  inquiries: number;
  newInquiries: number;
  pageViews: number;
  uniqueSessions: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await connectToDatabase();
  const [items, publishedItems, inquiries, newInquiries, pageViews, sessions] =
    await Promise.all([
      Item.estimatedDocumentCount(),
      Item.countDocuments({ published: true }),
      Inquiry.estimatedDocumentCount(),
      Inquiry.countDocuments({ status: "new" }),
      Event.countDocuments({ type: "page_view" }),
      Event.distinct("sessionId"),
    ]);
  return {
    items,
    publishedItems,
    inquiries,
    newInquiries,
    pageViews,
    uniqueSessions: (sessions as unknown[]).filter(Boolean).length,
  };
}

export interface ItemAnalyticsRow {
  itemId: string;
  title: string;
  category?: string;
  views: number;
  whatsappClicks: number;
  interestedClicks: number;
  pdfDownloads: number;
  quoteRequests: number;
}

export async function getItemAnalytics(): Promise<ItemAnalyticsRow[]> {
  await connectToDatabase();

  const [items, eventAgg, inquiryAgg] = await Promise.all([
    Item.find().select("title category").lean(),
    Event.aggregate<{ _id: { itemId: unknown; type: string }; count: number }>([
      { $match: { itemId: { $ne: null } } },
      { $group: { _id: { itemId: "$itemId", type: "$type" }, count: { $sum: 1 } } },
    ]),
    Inquiry.aggregate<{ _id: unknown; count: number }>([
      { $match: { itemId: { $ne: null } } },
      { $group: { _id: "$itemId", count: { $sum: 1 } } },
    ]),
  ]);

  const rows = new Map<string, ItemAnalyticsRow>();
  for (const it of items) {
    const id = String(it._id);
    rows.set(id, {
      itemId: id,
      title: it.title ?? "(untitled)",
      category: it.category ?? undefined,
      views: 0,
      whatsappClicks: 0,
      interestedClicks: 0,
      pdfDownloads: 0,
      quoteRequests: 0,
    });
  }

  const ensure = (id: string): ItemAnalyticsRow => {
    let row = rows.get(id);
    if (!row) {
      row = {
        itemId: id,
        title: "(deleted item)",
        views: 0,
        whatsappClicks: 0,
        interestedClicks: 0,
        pdfDownloads: 0,
        quoteRequests: 0,
      };
      rows.set(id, row);
    }
    return row;
  };

  for (const e of eventAgg) {
    const id = String(e._id.itemId);
    const row = ensure(id);
    switch (e._id.type) {
      case "page_view":
        row.views += e.count;
        break;
      case "whatsapp_click":
        row.whatsappClicks += e.count;
        break;
      case "interested_click":
        row.interestedClicks += e.count;
        break;
      case "pdf_download":
        row.pdfDownloads += e.count;
        break;
    }
  }

  for (const q of inquiryAgg) {
    ensure(String(q._id)).quoteRequests += q.count;
  }

  return [...rows.values()].sort(
    (a, b) =>
      b.views - a.views ||
      b.quoteRequests - a.quoteRequests ||
      b.whatsappClicks - a.whatsappClicks
  );
}
