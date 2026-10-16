# QAVIER

A collections-driven storefront, built as one Next.js app: `/` →
`/collections/<handle>` → `/products/<handle>` → bag → Shopify's hosted
checkout.

The layout follows a classic premium-apparel storefront: a slim accent
announcement bar, a white header with departments on the left, the wordmark
centred and search / account / bag on the right, full-width mega-menus with
link columns and featured products, a full-bleed hero, category tile rails,
four-up product grids with a Filters drawer, a two-up product gallery with a
sticky purchase panel, and a deep-forest footer. Type is a serif for titles and
product names, a clean sans for everything else, and small wide caps for
column headings. Qavier mint carries the primary buttons and promo badges;
`sale` red is reserved for markdowns.

**The menu is a fixed department tree** — Men, Women, Kids, New Arrivals,
Gifts, Sale, Discover — whose links point at Shopify collections by handle.
Links whose collection doesn't exist yet are hidden, so the menu never offers
an empty page. See [Collections → the menu](#collections--the-menu).

> **Live data comes from Shopify.** Until Shopify is connected, previews and
> local builds serve a **demo catalogue** (`lib/demo`) so every page can be seen
> fully composed. It is never served on a Vercel *production* deployment —
> there the grid stays empty until Shopify is wired up. Set `QAVIER_DEMO=on`
> to force it on (or `off` to force it off) anywhere.

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

### Collections → the menu

The header menu, the footer's Shop column, the home page's category row and the
tiles above each collection grid all point at collections **by handle**. Create
these collections in Shopify (**Products → Collections**, using exactly these
handles) and each one appears in the menu as soon as it exists:

| Department | Collection handles |
|---|---|
| **Men** | `men`, `mens-polos`, `mens-t-shirts`, `mens-sweatshirts-hoodies`, `mens-pants`, `mens-shorts`, `mens-swimwear`, `mens-outerwear` |
| **Women** | `women`, `womens-polos`, `womens-t-shirts`, `womens-sweatshirts-hoodies`, `womens-bottoms` |
| **Kids** | `kids`, `kids-polos`, `kids-t-shirts`, `kids-sweatshirts-hoodies`, `kids-pants`, `matching-sets` |
| **Accessories** (in the Men/Women menus) | `accessories`, `hats`, `bags`, `socks`, `belts` |
| **Featured** | `new-arrivals`, `best-sellers`, `golf`, `gifts`, `gifts-under-1500`, `sale` |

- A department's mega-menu shows its first four products on the right — Men
  reads the `men` collection, and so on.
- A collection whose handle isn't in the tree still appears, under an extra
  **Collections** menu item, so nothing you create is unreachable.
- Give a collection an **image** in Shopify for its tile. Without one it
  borrows its first product's photo.

The tree itself lives in `MENU` in `lib/nav.ts`.

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
    layout.tsx          → announcement bar + nav + footer; builds the menu
    page.tsx (home) · shop/ · collections/ · collections/[handle]/
    products/[handle]/ · cart/ · checkout/ · order-confirmed/ · about/
    account/ · pages/faq/ · pages/size-guide/
  legal/                → policies, outside the store's gate
  api/revalidate/       → Shopify webhook → cache flush
components/
  logo.tsx (Logo + Wordmark) · coming-soon.tsx
  store/    → announcement bar, nav (mega-menu, search, mobile drawer), hero,
              category rail, product card, product rail + tabs, editorial
              banners, value props, shop grid (filters, sort), gallery,
              purchase (product view), footer
  shared/   → cart context + drawer, ShopImage, garment art, size chart,
              Reveal, analytics
lib/
  config.ts   → store gate, site URL, analytics id, account URL
  nav.ts      → the department menu, checked against Shopify collections
  demo/       → the demo catalogue for previews before Shopify is connected
  swatch.ts   → colour names → swatch dots
  shopify/    → Storefront API client, GraphQL queries, types
  legal.ts · shipping.ts · utils.ts · actions.ts
```

### Design tokens

In `tailwind.config.ts`: `ink` (text), `paper`, `shell` (image wells), `line`,
`mute` (secondary text), `forest` (the footer), `accent` / `accent-soft`
(Qavier mint — primary pills and promo badges) and `sale` for markdowns. Type
is Source Serif 4 (`font-serif`), Inter (`font-sans`) and Archivo
(`font-display`, set wide for small caps), all variable fonts.

Shared primitives live in `app/globals.css`: `.wrap`, `.label`, `.h-page`,
`.h-section`, `.h-product`, `.btn` (mint pill), `.btn-dark`, `.btn-ghost`,
`.btn-box`, `.chip`, `.badge`, `.field`, `.photo-frame`.

### Demo catalogue imagery

Demo products draw a flat illustration of the garment in its colourway until a
photograph exists. Drop photos into `public/images/demo/` named
`<product-handle>-<n>.jpg` (n = 1–4: colour 1 front, colour 1 back, colour 2
front, colour 2 back) and they replace the illustrations automatically.

---

## Notes

- Fully responsive and mobile-first; respects `prefers-reduced-motion`.
- The header is solid and sticky on every page, so pages sit in normal flow
  underneath it — there is no top-padding offset to keep in sync.
- ⚠️ **The newsletter forms have no backend.** The footer sign-up and the
  field on the holding page post nowhere. Point their `action` at your
  email provider (Shopify customer form, Klaviyo, Mailchimp) before launch, or
  remove them — a field that silently swallows an address is worse than none.
- Announcement-bar copy, the product-page reassurance list and the value-prop
  strip all read `lib/shipping.ts`, so the promise on the home page is the
  promise at the till.
- The hero photograph is `public/images/homescreen.png`; the Men / Women panels
  and the wide banner on the home page use the other campaign images in
  `public/images/`.
- The header and footer use the wordmark `public/images/logotext.svg`
  (`<Wordmark />`); the footer and holding page use the stacked mark
  `public/images/logo.png` (`<Logo invert />` flips it white).
- The account icon goes to Shopify's hosted customer account once
  `SHOPIFY_STORE_DOMAIN` is set, and to a simple order-help page before that.
- The cart persists in `localStorage`; checkout hands off to Shopify's hosted
  checkout (requires the `SHOPIFY_*` env vars).
- With no Shopify credentials, product functions serve the demo catalogue on
  previews and local builds, and empty results on Vercel production.
- Google Analytics 4 (gtag.js) is rendered into `<head>` from the root layout,
  so every page carries the tag exactly once. Production builds only.
