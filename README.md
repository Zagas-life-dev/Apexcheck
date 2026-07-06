# Apexcheck — Medical Device Catalog

A single-seller medical device catalog + inquiry site. Buyers browse products and send
inquiries; the admin manages the catalog, inquiries, and views analytics.

Built with **Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui (Base UI) ·
MongoDB/Mongoose · Cloudinary · Paystack (scaffolded)**.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000. **No external accounts are required for local dev** — if
`MONGODB_URI` is unset, the app boots an in-memory MongoDB and auto-seeds 6 sample products.
(In-memory data is not persisted between restarts.)

- **Public site:** `/`, `/catalog`, `/catalog/[itemId]`, `/policies/*`
- **Admin:** `/admin/login` → dev credentials `admin@apexcheck.local` / `admin1234`

## Configuration

Copy `.env.example` to `.env.local` and fill in what you need. Everything is optional in
dev; here's what each group unlocks:

| Group | Purpose | Without it |
| --- | --- | --- |
| `MONGODB_URI` | Real, persistent database (e.g. MongoDB Atlas free tier) | Ephemeral in-memory DB, auto-seeded |
| `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` | Admin login | Dev fallback `admin1234` (disabled in production) |
| `JWT_SECRET` | Signs the admin session cookie | Insecure dev default (set in production!) |
| `CLOUDINARY_*` | Image/document uploads | Falls back to local disk (`/public/uploads`, dev only) |
| `RESEND_API_KEY` + `ADMIN_NOTIFICATION_EMAIL` | Email on new inquiry | Logged to server console |
| `NEXT_PUBLIC_*` | Business name, WhatsApp number, contact, compliance text | Placeholder defaults |
| `PAYSTACK_*` | Payment scaffold (not a live charge flow yet) | Inactive |

Generate an admin password hash:

```bash
npm run hash-password -- "your-password"   # prints ADMIN_PASSWORD_HASH
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` / `npm start` | Production build / serve |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run seed` / `npm run seed -- --reset` | Seed a real DB (set `MONGODB_URI` first) |
| `npm run hash-password -- "pw"` | Generate a bcrypt admin password hash |

## Structure

```
src/
  app/
    (site)/            Public pages (shared header/footer) — landing, catalog, policies
    admin/
      login/           Sign-in
      (panel)/         Auth-gated: dashboard, items, inquiries, analytics
    api/               auth, admin CRUD, public inquiries, events, upload, pdf
    error.tsx · not-found.tsx
  components/          ui/ (shadcn), site/, admin/, shared
  lib/                 db, auth, storage, email, pdf, analytics, config, validators
  models/              Item, Inquiry, Event (Mongoose)
  proxy.ts             Route gate for /admin (Next 16 "proxy" convention)
scripts/               seed, hash-password
```

## Key behaviors

- **Item detail:** photo gallery, spec table, certification badges, B2C retail + B2B tier
  pricing, stock status, per-item PDF spec sheet, WhatsApp enquiry, quote request form.
- **Inquiries:** business/personal toggle; admin updates status + payment status; email
  notification to admin (or console log).
- **WhatsApp + OG:** `wa.me` links with pre-filled messages; Open Graph meta per item for
  rich share previews.
- **Analytics:** self-rolled event tracking (`page_view`, `whatsapp_click`,
  `interested_click`, `pdf_download`) with a ranked per-item admin table.
- **PDF:** `/api/pdf/catalog` (full catalog) and `/api/pdf/item/[id]` (spec sheet), generated
  from live data with `@react-pdf/renderer`.

## Deploy (Vercel)

1. Set env vars in the Vercel project — **`MONGODB_URI` and `JWT_SECRET` are required in
   production** (the in-memory fallback and dev password are disabled there).
2. Configure Cloudinary for uploads (local-disk fallback is dev-only / ephemeral on Vercel).
3. Point your domain early — DNS can take time to propagate.

## Notes / follow-ups

- Policy pages ship placeholder first-draft text — **have them reviewed by a qualified
  professional before launch** (they touch liability/warranty for medical devices).
- `requiresFullPayment` is a manual per-item admin flag (simplest rule).
- Paystack is scaffolded (schema fields + config) — no live checkout wired yet.
- Sample seed data stands in for the real catalog; replace via the admin editor or a seed
  import once `MONGODB_URI` points at a real database.
# Apexcheck
