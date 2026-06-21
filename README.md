# QAVIER — Two Worlds, One Name

A dual-universe fashion house, built as one Next.js app:

- **Qavier Luxe** (`/luxe`) — quiet luxury. Noir, ivory & champagne. Serif editorial, generous whitespace, slow elegant motion.
- **Qavier Pops** (`/pops`) — Gen-Z maximalism. Acid lime, hot magenta, electric violet & cyan. Neobrutalist, chunky type, marquees, stickers.

Visitors land on a split-screen **portal** (`/`) and choose their universe. Each universe has its own navigation, footer, cart skin, product cards and voice — but they share one cart and one Shopify backend.

> **It runs right now with zero backend.** Until you connect Shopify, the whole
> site is powered by a built-in demo catalogue, and every photo slot renders a
> branded "imagery forthcoming" frame — so you can preview the full experience
> and drop real product photography in later with no layout changes.

---

## Tech stack

| | |
|---|---|
| Framework | Next.js 14 (App Router, Server Components) |
| Language | TypeScript |
| Styling | Tailwind CSS (two namespaced design systems: `luxe-*` / `pops-*`) |
| Motion | Framer Motion |
| Commerce | Shopify Storefront API (GraphQL) with transparent mock-data fallback |
| Deploy | Vercel |

---

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. You'll see the portal — pick **Luxe** or **Pops**.

### Useful scripts

```bash
npm run dev        # local dev server
npm run build      # production build
npm run start      # run the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

---

## Connecting Shopify (Storefront API)

The site auto-detects Shopify. The moment the env vars below are present, it
switches from demo data to your real catalogue and enables real checkout — no
code changes required.

1. In Shopify admin, install/enable **Headless** (or create a custom app) and
   generate a **Storefront API access token**.
2. Tag products so they land in the right universe:
   - add the tag **`luxe`** to Qavier Luxe products,
   - add the tag **`pops`** to Qavier Pops products.
   (Anything without a `pops` tag is treated as Luxe.)
3. Optionally create two collections with handles `qavier-luxe` and
   `qavier-pops`.
4. Optional product metafields (namespace `custom`): `material`, `tagline`.
5. Copy `.env.example` to `.env.local` and fill in:

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxxxxxxxxxxxxx
SHOPIFY_API_VERSION=2024-07
```

Restart `npm run dev`. Done — real products, real cart, real checkout.

### Adding product photography

Once Shopify is connected, product images come straight from the Shopify CDN
and replace the placeholder frames automatically. For editorial/campaign slots
(hero, lookbook, the feed, bento tiles) the `<ShopImage>` / `<PlaceholderFrame>`
components mark every photo zone with a label — swap them for `next/image` or
wire them to metafields when your shots are ready.

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it on [Vercel](https://vercel.com/new) — it auto-detects Next.js.
3. Add the `SHOPIFY_*` environment variables in **Project → Settings →
   Environment Variables** (leave them out to deploy the demo experience).
4. Deploy. `vercel.json` already sets the framework, region and security headers.

---

## Project structure

```
app/
  page.tsx              → the portal (choose your universe)
  layout.tsx            → root layout, fonts, metadata
  globals.css           → Tailwind + shared component primitives
  luxe/                 → Qavier Luxe universe (reference-style, page-based cart)
    page.tsx · shop/ · collection/ · products/[handle]/ · about/
    journal/ · cart/ · checkout/ · order-confirmed/
  pops/                 → Qavier Pops universe (neobrutalist, slide-over cart)
    page.tsx · shop/ · products/[handle]/ · drops/
components/
  shared/   → ShopImage, cart context + drawer, Reveal, Marquee
  luxe/     → nav, footer, product card, purchase panel
  pops/     → nav, footer, product card, purchase panel
  portal/   → the split-screen portal
lib/
  shopify/  → Storefront API client, GraphQL queries, types, demo catalogue
  utils.ts  → cn(), formatPrice(), discountPercent()
  actions.ts→ checkout server action
```

### Design tokens

Both palettes live in `tailwind.config.ts` as namespaced tokens
(`luxe-champagne`, `pops-magenta`, …) plus shared keyframes/animations, so
components never hard-code hex values. Fonts are wired through `next/font`
(`Cormorant Garamond`, `Jost`, `Space Grotesk`) in `app/fonts.ts`.

---

## Notes

- Fully responsive and mobile-first; respects `prefers-reduced-motion`.
- The cart persists in `localStorage` and is shared across both universes.
- In demo mode, checkout shows a friendly preview notice instead of redirecting.
