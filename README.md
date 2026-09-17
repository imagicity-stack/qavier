# QAVIER

A single-portal storefront, built as one Next.js app. An intro animation opens
onto a full-bleed hero, then the collection: `/` → `/shop` → `/products/<handle>`
→ cart → Shopify's hosted checkout.

The design is deliberately spare — near-black ink on paper, one hairline rule,
two typefaces, and photography doing the work.

> **All catalogue data comes from Shopify.** There is no demo catalogue — the
> grid is simply empty until you connect a store, so the site is production-ready
> the moment Shopify is wired up. Every photo slot renders a quiet
> "imagery forthcoming" frame until real images arrive.

---

## Tech stack

| | |
|---|---|
| Framework | Next.js 14 (App Router, Server Components) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Motion | Framer Motion |
| Commerce | Shopify Storefront API (GraphQL) |
| Deploy | Vercel |

---

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Until Shopify is connected the store renders with
an empty grid — everything else works. Add the Shopify env vars below to
populate the catalogue.

```bash
npm run dev        # local dev server
npm run build      # production build
npm run start      # run the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

---

## Connecting Shopify (Storefront API)

The app talks to Shopify's **Storefront API** for products and checkout. Once
the env vars are set, real products and real (hosted) checkout light up with no
code changes.

### 1. Get a Storefront API access token

The app just needs a **public Storefront API token**. Either method below
produces the same token — pick whichever is easier.

**Option A — Headless channel (easiest, recommended):**

1. Install the free **Headless** sales channel from the Shopify App Store
   (*Settings → Apps and sales channels → Shopify App Store* → search
   **"Headless"** → Add channel).
2. Open **Headless** → **Create storefront** (or use the default one).
3. Under **Storefront API → Manage / API keys**, copy the **public access
   token**. The product-read and checkout scopes are enabled for you.

**Option B — Custom app (if you'd rather not add a channel):**

1. **Settings → Apps and sales channels → Develop apps → Create an app**.
2. **Configuration → Storefront API → Configure**, and enable at least:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_tags`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_write_checkouts` and `unauthenticated_read_checkouts`
3. **Install** the app, then under **API credentials** copy the
   **Storefront API access token**.

Either way it's a public, browser-safe token (sent as
`X-Shopify-Storefront-Access-Token`) — not the Admin API token.

### 2. Set environment variables

Copy `.env.example` to `.env.local` (local) or add these in **Vercel → Settings →
Environment Variables** (production):

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com   # your *.myshopify.com domain
SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxxxxxxxxxxxxx # the token from step 1
SHOPIFY_API_VERSION=2024-07                      # optional; sensible default
```

Restart `npm run dev` (or redeploy). That's it — products, cart and checkout are
now live. Checkout hands off to Shopify's secure hosted checkout.

### 3. Keep prices in sync

Shopify is the single source of truth for price — nothing is hard-coded here —
but catalogue reads are cached so the storefront stays fast. Two knobs control
how quickly an edit in the Shopify admin shows up:

```bash
SHOPIFY_REVALIDATE_SECONDS=60   # max age of cached catalogue data (0 = always live)
SHOPIFY_WEBHOOK_SECRET=         # signing secret for instant, on-demand flushes
```

Without a webhook, a price edit appears within `SHOPIFY_REVALIDATE_SECONDS`.
For instant updates, add a webhook in **Shopify → Settings → Notifications →
Webhooks** for each of `products/create`, `products/update`, `products/delete`
and `collections/update`, pointing at:

```
https://<your-domain>/api/revalidate
```

Then paste the signing secret Shopify shows you into `SHOPIFY_WEBHOOK_SECRET`.
The route verifies the HMAC and clears the affected cache tags, so the new price
is live on the next page view.

To flush by hand, set `SHOPIFY_REVALIDATE_SECRET` and call:

```bash
curl -X POST "https://<your-domain>/api/revalidate?secret=<token>"
```

The bag is separate: it lives in `localStorage` and stores the price each line
had when it was added. It re-reads those prices from Shopify (uncached) on load,
whenever the drawer opens, and on the Cart and Checkout pages — so a shopper
with a week-old bag still sees today's price, and the totals always match the
Shopify checkout they're handed off to.

---

### Category filter → the product **Type** field

Set the product's **Product type** (Shopify's built-in field) to a category like
`T-Shirts`, `Hoodies`, `Outerwear`. The Shop page builds its filter row
automatically from the types actually present, so a category with nothing in it
never appears. Every product in the store is listed — there are no section tags
to maintain any more.

### Size & colour filters → product **Options**

Add product **Options** named exactly **`Size`** and **`Color`** (with their
values, e.g. `S / M / L`, `Noir / Sand / Chocolate`). The shop's size buttons
buttons populate from these automatically. Sizes are re-ordered into wearing
order (XS → 2XL) whatever order Shopify lists them in.

### Editorial extras → **metafields** (namespace `custom`)

Optional, all under the `custom` namespace (Settings → Custom data → Products):

| Metafield key | Type | Shows as |
|---|---|---|
| `tagline` | Single line text | Product one-liner |
| `material` | Single line text | Fabric/material line |
| `badge` | Single line text | Corner badge on cards (e.g. `Bestseller`, `New`) |

### Images

Product images come straight from the Shopify CDN and replace the "imagery
forthcoming" placeholders automatically — no uploads to this repo needed.

## Legal pages

Five policies live at `/legal/<slug>` — **terms, privacy, shipping, returns,
contact**. They sit at the top level, deliberately outside the store's route
group, so they stay reachable even when the shop is behind its coming-soon
gate. The footer and the holding page link to them, and they're listed in
`sitemap.xml`.

The content is one source of truth in `lib/legal.ts`, so there is a single copy
to edit and no two pages can drift apart. Shipping charges, delivery windows and
the returns window come from `lib/shipping.ts`, which the checkout reads too —
the till and the policy page can never quote different numbers.

> ⚠️ **These are working drafts, not legal advice.** Have a lawyer review them
> before you take real orders — India's Consumer Protection (E-Commerce) Rules
> and the DPDP Act 2023 both place specific obligations on the seller.

**Before launch, fill in the `BUSINESS` block at the top of `lib/legal.ts`.**
Every field there renders literally on the page (`[Registered business name]`,
`[GSTIN]`, `[support@your-domain.com]`, …) so it is obvious what is still
outstanding — search the live site for `[` to find any you missed.

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it on [Vercel](https://vercel.com/new) — it auto-detects Next.js.
3. Add the `SHOPIFY_*` variables (catalogue/checkout) and any
   `NEXT_PUBLIC_*_STORE=live` flags in **Project → Settings → Environment
   Variables**.
4. Deploy. `vercel.json` already sets the framework, region and security headers.

---

## Project structure

```
app/
  layout.tsx            → root layout, fonts, analytics
  (main)/               → the store
    layout.tsx · page.tsx (home) · shop/ · products/[handle]/
    cart/ · checkout/ · order-confirmed/ · about/
  legal/                → policies, outside the store's gate
  api/revalidate/       → Shopify webhook → cache flush
components/
  intro-splash.tsx · logo.tsx · coming-soon.tsx
  store/    → nav, footer, hero, product card, gallery, purchase, shop grid
  shared/   → cart context + drawer, ShopImage, size chart, Reveal, analytics
lib/
  config.ts   → store gate, site URL, analytics id
  shopify/    → Storefront API client, GraphQL queries, types
  legal.ts · shipping.ts · utils.ts · actions.ts
```

### Design tokens

Five colours in `tailwind.config.ts` — `ink`, `paper`, `shell`, `line` — plus
Manrope (`font-display`) and Jost (`font-sans`). Shared primitives (`.label`,
`.btn`, `.btn-ghost`, `.field`) live in `app/globals.css`.

---

## Notes

- Fully responsive and mobile-first; respects `prefers-reduced-motion`.
- The intro animation plays once per browser session.
- The hero reads `public/images/hero.jpg` and `hero-mobile.jpg`. Until those
  exist a dark gradient stands in and the wordmark still reads.
- The cart persists in `localStorage`; checkout hands off to Shopify's hosted
  checkout (requires the `SHOPIFY_*` env vars).
- With no Shopify credentials, product functions return empty results — the
  storefront renders, the grid is just empty.
- Google Analytics 4 (gtag.js) is rendered into `<head>` from the root layout,
  so every page carries the tag exactly once. Production builds only.
