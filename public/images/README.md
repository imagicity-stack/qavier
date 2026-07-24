# Drop your photography here

Every photo slot in the site currently renders a branded **"imagery forthcoming"**
placeholder (with a small label describing what belongs there). There are two
ways to replace them with real images.

## The four worlds → `public/images/` (already wired)

Each world's **hub block** *and* its **store hero** use the same brand image.
Drop these exact files in and they appear automatically — no code changes.
Until a file exists the layer is transparent and the base colour shows through
(no broken-image icon); a brand-tinted gradient keeps the labels legible.

| World | Desktop (`md`+) | Mobile (below `md`) |
|---|---|---|
| Qavier | `desktop_qavier.png` | `mobile_qavier.png` |
| Luxe | `desktop_luxe.png` | `mobile_luxe.png` |
| Pops | `desktop_pops.png` | `mobile_pops.png` |
| Essentials | `desktop_essentials.png` | `mobile_essentials.png` |

- **Desktop** files back the 2×2 hub tiles + the wide store heroes — use a
  landscape crop (~1600–2000px wide).
- **Mobile** files back the stacked hub bands + tall mobile heroes — a
  portrait/tall crop frames best.

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
