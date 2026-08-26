import type { Product } from './shopify/types';

/**
 * The Pops category facets, in one place — used by the shop page's chips, the
 * side menu and the home-page tiles, so all three agree.
 *
 * Every category is derived from real Shopify data: a product joins one by
 * carrying the matching tag (or, for the garment categories, by its product
 * Type). Nothing here is a hardcoded product list — a category with no matching
 * products in Shopify simply isn't shown.
 */
export interface PopsCategory {
  slug: string;
  label: string;
  blurb: string;
  /** Tile colour on the home page. */
  bg: string;
  match: (p: Product) => boolean;
  /**
   * Show the whole catalogue when nothing matches. Used for women/men, which
   * are only meaningful once gendered tags exist in Shopify — until then the
   * line is unisex and these show everything rather than an empty grid.
   */
  fallbackToAll?: boolean;
}

const hasTag = (p: Product, tag: string) =>
  p.tags.some((t) => t.toLowerCase() === tag);

/** A garment category matches its tag, or a Shopify product Type of the same name. */
const isType = (p: Product, slug: string) =>
  hasTag(p, slug) || (p.productType ?? '').toLowerCase() === slug;

export const POPS_CATEGORIES: PopsCategory[] = [
  {
    slug: 'all',
    label: 'shop all',
    blurb: "everything we've got, all in one chaotic place 🫠",
    bg: 'bg-pops-lime',
    match: () => true,
  },
  {
    slug: 'women',
    label: 'women',
    blurb: 'the full line — styled for her',
    bg: 'bg-pops-pink',
    match: (p) => hasTag(p, 'women'),
    fallbackToAll: true,
  },
  {
    slug: 'men',
    label: 'men',
    blurb: 'the full line — styled for him',
    bg: 'bg-pops-blue',
    match: (p) => hasTag(p, 'men'),
    fallbackToAll: true,
  },
  {
    slug: 'new',
    label: 'new arrivals',
    blurb: 'fresh off the drop, still warm',
    bg: 'bg-pops-cyan',
    match: (p) => hasTag(p, 'new'),
  },
  {
    slug: 'trending',
    label: 'trending',
    blurb: 'what everyone is copping rn',
    bg: 'bg-pops-violet',
    match: (p) => hasTag(p, 'drop') || hasTag(p, 'bestseller'),
  },
  {
    slug: 'bestsellers',
    label: 'best sellers',
    blurb: 'the hall of fame',
    bg: 'bg-pops-orange',
    match: (p) =>
      hasTag(p, 'bestseller') || ['BESTSELLER', 'CULT FAVE'].includes(p.badge ?? ''),
  },
  {
    slug: 'sale',
    label: 'sale',
    blurb: 'get it before someone else does',
    bg: 'bg-pops-magenta',
    match: (p) => hasTag(p, 'sale'),
  },
  {
    slug: 'tops',
    label: 'tops',
    blurb: 'tees, hoodies & everything up top',
    bg: 'bg-pops-lime',
    match: (p) => isType(p, 'tops'),
  },
  {
    slug: 'bottoms',
    label: 'bottoms',
    blurb: 'cargos, skirts & the rest',
    bg: 'bg-pops-cyan',
    match: (p) => isType(p, 'bottoms'),
  },
  {
    slug: 'outerwear',
    label: 'outerwear',
    blurb: 'puffers, bombers, layers',
    bg: 'bg-pops-pink',
    match: (p) => isType(p, 'outerwear'),
  },
  {
    slug: 'footwear',
    label: 'footwear',
    blurb: 'stompers only',
    bg: 'bg-pops-yellow',
    match: (p) => isType(p, 'footwear'),
  },
];

export function findPopsCategory(slug?: string): PopsCategory {
  return POPS_CATEGORIES.find((c) => c.slug === slug) ?? POPS_CATEGORIES[0];
}

/** Products in a category, honouring the women/men fallback. */
export function filterPopsCategory(products: Product[], cat: PopsCategory): Product[] {
  const matched = products.filter(cat.match);
  return matched.length === 0 && cat.fallbackToAll ? products : matched;
}

/** The garment categories that actually have stock, for the home-page tiles. */
export function popsCategoryTiles(products: Product[]) {
  return ['tops', 'bottoms', 'outerwear', 'footwear']
    .map((slug) => POPS_CATEGORIES.find((c) => c.slug === slug)!)
    .map((cat) => ({ cat, products: products.filter(cat.match) }))
    .filter((tile) => tile.products.length > 0);
}
