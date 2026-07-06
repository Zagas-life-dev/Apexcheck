# Medical Device Catalog Website: V1 Build Plan

Single seller, dedicated site. No multi-tenant signup. Admin (your bro) manages everything, buyers browse and inquire.

---

## 1. Stack

- **Framework**: Next.js
- **Hosting**: Vercel
- **Database**: MongoDB Atlas, accessed via Mongoose
- **Images**: Cloudinary (upload, storage, transforms for mobile-friendly delivery)
- **Admin auth**: Single admin login, hashed password, session/JWT cookie. No public signup, no multi-provider auth needed.
- **Payments**: Paystack, scaffolded only (schema fields and config ready, no live charge flow this weekend)

---

## 2. Data Models (Mongoose)

### `Item`
```
title: String
description: String
category: String        // diagnostic, monitoring, mobility aids, PPE, consumables, equipment
brand: String
model: String
images: [{ url, publicId }]         // Cloudinary
specs: [{ label, value }]           // flexible technical fields
certifications: [{ name, number, issuer }]  // CE mark, Ghana FDA reg, ISO, etc.
documents: [{ url, label }]         // datasheets, manuals (Cloudinary raw upload)
pricingTiers: [{ minQty, unitPrice }]   // B2B bulk pricing
retailPrice: Number                 // B2C price
stockStatus: enum [in_stock, out_of_stock, preorder]
leadTime: String                    // if preorder
warranty: String
requiresFullPayment: Boolean        // flags high-value/custom items
paystackReady: Boolean              // scaffold flag, not active yet
createdAt, updatedAt
```

### `Inquiry`
```
itemId: ObjectId
buyerType: enum [business, personal]
companyName: String        // if business
contactName: String
contactInfo: String        // phone/email/WhatsApp number
quantity: Number
deliveryLocation: String
notes: String
status: enum [new, contacted, quoted, closed_won, closed_lost]
paymentStatus: enum [unpaid, mobilization_paid, fully_paid]
createdAt
```

### `Event`
```
type: enum [page_view, whatsapp_click, interested_click, pdf_download]
itemId: ObjectId (optional)
page: String
referrer: String
sessionId: String
createdAt
```

---

## 3. Page / Route List

### Public
- `/` : Landing page (hero, what the business does, category overview, trust signals, CTA into catalog)
- `/catalog` : Full catalog, search + category filters, stock status visible
- `/catalog/[itemId]` : Item detail page. Photo gallery, specs, certs, documents, both prices (B2C + B2B tiers), WhatsApp button, Request Quote button, OG meta tags for share previews
- `/policies/import-policy`
- `/policies/terms-and-conditions`
- `/policies/terms-of-use`
- `/policies/payment-policy`
- `/404` and general error/loading states

### Admin (auth-gated)
- `/admin/login`
- `/admin/dashboard` : Overview, analytics summary
- `/admin/items` : List, create, edit, delete items
- `/admin/items/[id]` : Full item editor (specs, certs, documents, pricing tiers)
- `/admin/inquiries` : List with status filter, click into each to update status/payment status
- `/admin/analytics` : Per-item views, WhatsApp clicks, PDF downloads, quote requests (ranked table)

---

## 4. Core Feature Behavior

**Item detail page**
- Multiple photos, gallery view
- Specs shown as a clean table, not paragraph text
- Certifications displayed prominently (badge-style), since this is a trust signal for medical buyers
- Datasheet/manual download link if present
- Retail price shown for B2C, tiered pricing table shown for B2B, both live on the same page
- Stock status badge, lead time shown if preorder
- "Download Spec Sheet (PDF)" button, per-item

**Inquiry flow**
- Toggle at top: "Buying for a business/clinic" vs "Personal use"
- Business: company name, contact name, contact info, quantity, delivery location, notes
- Personal: name, contact info, notes
- On submit: creates `Inquiry`, status = new, fires event, sends email notification to admin

**WhatsApp integration (core, not optional)**
- `wa.me` link per item, pre-filled message with item name + item URL
- Open Graph meta tags per item page (title, image, price) so shared links render a proper preview card in WhatsApp
- Same wa.me pattern usable from the landing page (general contact)

**PDF export**
- Full catalog PDF: auto-generated, branded, pulls live item data
- Per-item PDF spec sheet: generated on demand from the item detail page
- First pass: functional over polished. Refine styling only if time remains.

**Analytics (self-rolled via `Event` collection)**
- Track: page_view, whatsapp_click, interested_click, pdf_download
- Admin analytics view: total visits, unique sessions, per-item ranked table (views, WhatsApp clicks, PDF downloads, quote requests)
- No charts in v1, simple ranked table. Time-series charts are an easy phase 2 add with recharts once event volume exists.

**Payment logic (scaffolded)**
- `paymentStatus` on Inquiry: unpaid, mobilization_paid, fully_paid
- Order only proceeds to "processing" once paymentStatus is mobilization_paid or fully_paid
- `requiresFullPayment` flag on Item marks cases where mobilization isn't enough (high-value equipment, custom/import-on-request items). You'll need to decide the exact rule (value threshold vs category vs manual flag per item), simplest for this weekend: manual flag per item, set by admin.
- Paystack config present in env/setup, no live checkout wired yet.

---

## 5. Trust & Compliance Content (needed on-site)

- Ghana FDA registration number (business-level, and per-device where applicable)
- Business registration details, physical address/showroom if applicable, years in operation
- Accepted payment methods listed clearly (bank transfer, MTN MoMo, cash on delivery, etc., whatever actually applies)
- Delivery/shipping coverage area
- Policy pages: Import Policy, Terms & Conditions, Terms of Use, Payment Policy. Ship placeholder/first-draft text this weekend, get it reviewed by someone qualified before or shortly after real launch, since this touches liability and warranty claims for medical devices.

---

## 6. Operational Basics

- Admin auth: single login, no public signup
- Seed data plan: decide now whether you're hand-entering the existing Word doc catalog or writing a quick import script (structure the Word content into JSON/CSV first, then bulk insert via a script). Bulk insert is worth the extra hour if the catalog has more than ~15-20 items.
- Domain + Vercel setup done early, DNS can take time to propagate, don't leave it for Sunday night.
- Basic error handling: broken links, failed image loads, empty states should never show a blank white screen.

---

## 7. Suggested Build Order (weekend)

1. Next.js project scaffold, Vercel + domain connected
2. Mongoose schemas + MongoDB Atlas connection
3. Cloudinary upload flow (needed before item editor is useful)
4. Admin auth (login gate)
5. Admin item editor (full CRUD, since nothing else works without data)
6. Public catalog + item detail pages
7. Inquiry form + email notification
8. WhatsApp links + OG meta tags
9. Event tracking (fire events from the pages already built)
10. Admin analytics view
11. PDF export (catalog + per-item)
12. Landing page
13. Policy pages (placeholder text acceptable)
14. Error/loading states, final pass

Cut-safely-if-short-on-time: PDF styling polish, policy page final wording, time-series analytics (all fine as rough/placeholder for a v1 launch, refine after).

---

## 8. Open Decisions For You

- Exact rule for `requiresFullPayment`: manual per-item flag (simplest), value threshold, or category-based?
- Seed data: hand-entered or import script from the existing Word catalog?
- Domain name, so DNS can be set up first thing.
