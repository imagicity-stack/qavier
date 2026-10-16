# Site imagery

Product photography comes from Shopify — every product image is pulled from the
Shopify CDN, so there is nothing to upload here for products.

The files in this folder are the store's own artwork:

| File | Where it appears |
|---|---|
| `logo.png` | Stacked logo (diamond over wordmark) — footer, holding page, intro animation |
| `logotext.svg` | Horizontal wordmark — header, mobile menu, legal pages |
| `homescreen.png` | Home page hero (full screen) |
| `desktop_qavier.png` | Home page Men / Women panels, About page, Discover menu tile, New Arrivals tile |
| `hero.webp` | Home page "Made in Small Runs" banner |
| `demo/` | Optional photos for the demo catalogue (see `demo/README.md`) |

To change a picture, replace the file with one of the same name — no code
changes. Landscape images around 1600–2000px wide work best for the hero and
banners; the panels crop to portrait, keeping the subject in frame with an
`object-position` set in `app/(main)/page.tsx`.
