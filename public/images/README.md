# Drop your photography here

Every photo slot in the site currently renders a branded **"imagery forthcoming"**
placeholder (with a small label describing what belongs there). There are two
ways to replace them with real images:

## Home hero → `public/images/homescreen.png`
The home page hero is already wired to this exact path. Just drop a file named
**`homescreen.png`** into `public/images/` and it appears automatically — no
code changes. Until that file exists, the hero shows the placeholder frame (no
broken-image icon). Use a large landscape image (~2000px wide) so it isn't
heavily cropped; a dark scrim keeps the headline and button legible.

## 1. Product photography → Shopify (recommended)
Once you connect Shopify (see the root `README.md`), product images are pulled
straight from the Shopify CDN and replace the product placeholders automatically.
No file uploads here needed.

## 2. Editorial / campaign imagery → this folder
For the hero, lookbook, "the feed", bento tiles and brand-story slots, add your
files here, e.g.:

```
public/images/luxe/hero.jpg
public/images/luxe/atelier.jpg
public/images/pops/hero.jpg
public/images/pops/campaign-01.jpg
```

Then point the relevant `<PlaceholderFrame …>` at your file by swapping it for a
`<ShopImage image={{ url: '/images/luxe/hero.jpg', altText: '…' }} universe="luxe" />`
(or a plain `next/image`). Each placeholder is labelled in the UI so you know
exactly which shot goes where.

Recommended: high-resolution JP/WebP, portrait 3:4 for Luxe product/editorial,
4:5 or 1:1 for Pops.
