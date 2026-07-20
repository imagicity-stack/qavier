# QAVIER

A contemporary fashion house, built as one Next.js app:

- **Qavier** (`/`) — the main store. Timeless, considered pieces. Noir, ivory & champagne; serif editorial, generous whitespace, slow elegant motion.
- **Qavier Pops** (`/pops`) — a loud, limited Gen-Z capsule, reached from the **Pops** entry in the menu. Acid lime, hot magenta, electric violet & cyan; neobrutalist, chunky type, marquees, stickers.

Visitors land straight in the main Qavier store (`/`). A header **search bar** and a **Pops** menu link lead into the rest of the site. Each storefront has its own navigation, footer, cart skin, product cards and voice — but they share one cart and one Shopify backend.

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

Open <http://localhost:3000>. You'll land in the main Qavier store; use the header search or the **Pops** menu link to explore.

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
2. Tag products so they land in the right storefront:
   - add the tag **`pops`** to Qavier Pops products,
   - main Qavier products use the internal `luxe` universe tag — anything without a
     `pops` tag is treated as main Qavier.
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

---

## Launch switch — "coming soon" → live

The main Qavier store (home, shop, collections, products, cart, checkout) ships
behind a **coming-soon holding page**. Qavier Pops (`/pops`) is a separate
universe and stays live the whole time — the holding page links to it.

When you're ready to sell the main line, open the store with **one setting**:

- **On Vercel (recommended, no code change):** Project → Settings → Environment
  Variables → set **`NEXT_PUBLIC_QAVIER_STORE=live`**, then redeploy.
- **Locally:** add `NEXT_PUBLIC_QAVIER_STORE=live` to `.env.local`.
- **Or in code:** flip `STORE_LIVE_FALLBACK` to `true` in `lib/config.ts`.

Set it back to `coming-soon` (or unset it) to put the holding page back up.
While it's `coming-soon`, the store routes are `noindex` and kept out of the
sitemap. Combine this with the Shopify env vars above and, the moment you go
live, you're adding products straight from Shopify.

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
  layout.tsx            → root layout, fonts, metadata
  globals.css           → Tailwind + shared component primitives
  (main)/               → the main Qavier store at the site root (page-based cart)
    layout.tsx · page.tsx · shop/ · collection/ · products/[handle]/
    about/ · journal/ · cart/ · checkout/ · order-confirmed/
  pops/                 → Qavier Pops capsule (neobrutalist, slide-over cart)
    page.tsx · shop/ · products/[handle]/ · drops/
components/
  shared/   → ShopImage, cart context + drawer, Reveal, Marquee
  luxe/     → main-store nav (with search bar), footer, product card, purchase panel
  pops/     → nav, footer, product card, purchase panel
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
- The cart persists in `localStorage` and is shared across the store and Pops.
- In demo mode, checkout shows a friendly preview notice instead of redirecting.
