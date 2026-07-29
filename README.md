# QAVIER

A contemporary fashion house, built as one Next.js app. The landing page (`/`)
is a **2×2 hub** of four worlds:

- **Qavier** — the flagship store (`/qavier` + `/shop`, `/cart`, …). Editorial,
  serif, generous whitespace.
- **Luxe** — the premium line (`/luxe`).
- **Pops** — a loud, limited Gen-Z capsule (`/pops`). Neobrutalist, chunky type,
  marquees, stickers.
- **Essentials** — everyday basics (`/essentials`). Warm and minimal.

Qavier is always open; Luxe, Pops and Essentials are individually switchable
between a **coming-soon** holding page and their live store (see
[The four worlds](#the-four-worlds--launch-switches)).

> **All catalogue data comes from Shopify.** There is no demo/placeholder
> catalogue — product grids are simply empty until you connect a store, so the
> site is production-ready the moment Shopify is wired up. Every photo slot
> renders a branded "imagery forthcoming" frame until real images arrive.

---

## Tech stack

| | |
|---|---|
| Framework | Next.js 14 (App Router, Server Components) |
| Language | TypeScript |
| Styling | Tailwind CSS (two namespaced design systems: `luxe-*` / `pops-*`) |
| Motion | Framer Motion |
| Commerce | Shopify Storefront API (GraphQL) |
| Deploy | Vercel |

---

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Until Shopify is connected the storefronts render
with empty product areas — everything else (hub, navigation, coming-soon pages)
works. Add the Shopify env vars below to populate the catalogue.

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

## Sections on Shopify — routing a product to the right world

This is the important part: **how a product ends up in Qavier, Luxe, Pops or
Essentials.** It's driven entirely by fields you set in the Shopify product
editor — no code, no redeploy.

### Which world → a product **tag**

Add the matching **tag** to a product and it appears in that world's store:

| World | Route | Add this tag | Template / cart |
|---|---|---|---|
| Qavier (flagship) | `/qavier`, `/shop` | `qavier` | Editorial |
| Luxe | `/luxe` | `luxe` | Editorial |
| Pops | `/pops` | `pops` | **Pops** (neobrutalist, slide-over cart) |
| Essentials | `/essentials` | `essentials` | Editorial |

- A product can carry **several** section tags to appear in more than one world
  (e.g. tag a hero tee `qavier` **and** `essentials`).
- The **`pops` tag is special**: besides placing the product in Pops, it renders
  that product with the Pops visual template and slide-over cart. Everything
  without a `pops` tag uses the editorial template.
- Tags are case-insensitive.

### Category (shop filter) → the product **Type** field

Set the product's **Product type** (Shopify's built-in field) to a category like
`Tees`, `Hoodies`, `Outerwear`. The flagship **Shop** filters and the
**Collections** page build their category lists automatically from the product
types present — nothing is hard-coded.

### Merchandising within a world → extra **tags**

| Goal | Add this tag | Surfaces at |
|---|---|---|
| New Arrivals | `new` | header nav → `/shop?q=new` |
| Bestsellers | `bestseller` | header nav → `/shop?q=bestseller` |

Any tag is also searchable from the header **search bar**. Add whatever
merchandising tags you like.

### Size & colour filters → product **Options**

Add product **Options** named exactly **`Size`** and **`Color`** (with their
values, e.g. `S / M / L`, `Noir / Sand / Chocolate`). The shop's size buttons
and colour swatches populate from these automatically. Swatch colours are mapped
by name in `components/luxe/luxe-shop.tsx` / `components/home/tee-card.tsx` — add
any custom colour names there.

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

### Worked example — a Pops product

1. Create the product in Shopify.
2. **Tags:** `pops`, `new` (drops it into Pops + New Arrivals).
3. **Product type:** `Tees`.
4. **Options:** `Size` = S/M/L/XL, `Color` = Lime/Black.
5. **Metafields:** `tagline` = "shrunken fit, maximum chaos", `badge` = `NEW`.
6. Set `NEXT_PUBLIC_POPS_STORE=live` (below) and it's shoppable at `/pops`.

---

## The four worlds & launch switches

Qavier (the flagship) is **always open**. Luxe, Pops and Essentials each default
to a **coming-soon holding page** (each in its own visual style) and flip to
their live store with **one setting** — no code change:

- **On Vercel:** Project → Settings → Environment Variables → set the world's var
  to `live`, then redeploy:
  - `NEXT_PUBLIC_LUXE_STORE=live`
  - `NEXT_PUBLIC_POPS_STORE=live`
  - `NEXT_PUBLIC_ESSENTIALS_STORE=live`
- **Locally:** add the same to `.env.local`.

Set a var back to `coming-soon` (or unset it) to put the holding page back up.
While a world is coming-soon its routes are `noindex` and kept out of the
sitemap. Going live + connecting Shopify is all it takes to start selling that
world.

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
  layout.tsx            → root layout, fonts, metadata
  page.tsx              → the 2×2 landing hub (+ intro splash)
  globals.css           → Tailwind + shared component primitives
  (main)/               → the Qavier flagship store (editorial, page-based cart)
    layout.tsx · qavier/ · shop/ · collection/ · products/[handle]/
    about/ · journal/ · cart/ · checkout/ · order-confirmed/
  luxe/ · essentials/   → gated worlds (coming-soon page or live store)
  pops/                 → Qavier Pops capsule (neobrutalist, slide-over cart)
components/
  hub.tsx · intro-splash.tsx      → landing hub + intro animation
  *-coming-soon.tsx               → per-world holding pages
  luxe-landing.tsx · essentials-store.tsx
  shared/   → ShopImage, cart context + drawer, Reveal, Marquee
  luxe/     → flagship nav (search), footer, product card, purchase panel
  pops/     → nav, footer, product card, purchase panel
  home/     → tee-card (home/essentials product card)
lib/
  config.ts → world/launch switches (LUXE_LIVE, POPS_LIVE, …)
  shopify/  → Storefront API client, GraphQL queries, types
  utils.ts  → cn(), formatPrice(), discountPercent()
  actions.ts→ checkout server action
```

### Design tokens

Both palettes live in `tailwind.config.ts` as namespaced tokens
(`luxe-champagne`, `pops-magenta`, …) plus shared keyframes/animations, so
components never hard-code hex values. Fonts are wired through `next/font` in
`app/fonts.ts`.

---

## Notes

- Fully responsive and mobile-first; respects `prefers-reduced-motion`.
- The cart persists in `localStorage`; checkout hands off to Shopify's hosted
  checkout (requires the `SHOPIFY_*` env vars).
- With no Shopify credentials, product functions return empty results — the
  storefront renders, product grids are just empty.
