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

/**
 * Tag vocabulary. Stores don't all use the same words — "bottomwear", "upper"
 * and "bottoms" all mean the same rail — so each category accepts a list of
 * synonyms. Match on the Shopify tag OR the product Type, either of which may
 * use any spelling below. To support another word, add it to the list; nothing
 * else needs to change.
 */
const ALIASES: Record<string, string[]> = {
  tops: [
    'tops', 'top', 'upper', 'uppers', 'upperwear', 'upper-wear', 'topwear',
    'top-wear', 'tees', 'tee', 't-shirts', 'tshirts', 't-shirt', 'tshirt',
    'shirts', 'shirt', 'hoodies', 'hoodie', 'sweatshirts', 'crop-tops',
  ],
  bottoms: [
    'bottoms', 'bottom', 'bottomwear', 'bottom-wear', 'lowers', 'lower',
    'cargos', 'cargo', 'pants', 'trousers', 'joggers', 'jeans', 'denim',
    'skirts', 'skirt', 'shorts',
  ],
  outerwear: [
    'outerwear', 'outer', 'outer-wear', 'jackets', 'jacket', 'puffers',
    'puffer', 'bombers', 'bomber', 'coats', 'coat', 'layers',
  ],
  footwear: [
    'footwear', 'foot-wear', 'shoes', 'shoe', 'sneakers', 'sneaker', 'boots',
    'boot', 'stompers', 'slides',
  ],
  women: ['women', 'woman', 'womens', "women's", 'female', 'her'],
  men: ['men', 'man', 'mens', "men's", 'male', 'him'],
  new: ['new', 'new-arrival', 'new-arrivals', 'newin', 'new-in'],
  bestseller: ['bestseller', 'bestsellers', 'best-seller', 'best-sellers'],
  sale: ['sale', 'on-sale', 'clearance', 'discount'],
};

/** Normalise a tag or type for comparison: lowercase, spaces/underscores → dashes. */
const norm = (value: string) =>
  value.toLowerCase().trim().replace(/[\s_]+/g, '-');

/**
 * True when the product carries any of the category's words, as a tag or as its
 * Shopify product Type.
 */
function matches(p: Product, key: string): boolean {
  const words = ALIASES[key] ?? [key];
  const fields = [...p.tags, p.productType ?? ''].map(norm).filter(Boolean);
  return words.some((w) => fields.includes(norm(w)));
}

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
    match: (p) => matches(p, 'women'),
    fallbackToAll: true,
  },
  {
    slug: 'men',
    label: 'men',
    blurb: 'the full line — styled for him',
    bg: 'bg-pops-blue',
    match: (p) => matches(p, 'men'),
    fallbackToAll: true,
  },
  {
    slug: 'new',
    label: 'new arrivals',
    blurb: 'fresh off the drop, still warm',
    bg: 'bg-pops-cyan',
    match: (p) => matches(p, 'new'),
  },
  {
    slug: 'trending',
    label: 'trending',
    blurb: 'what everyone is copping rn',
    bg: 'bg-pops-violet',
    match: (p) => matches(p, 'drop') || matches(p, 'bestseller'),
  },
  {
    slug: 'bestsellers',
    label: 'best sellers',
    blurb: 'the hall of fame',
    bg: 'bg-pops-orange',
    match: (p) =>
      matches(p, 'bestseller') || ['BESTSELLER', 'CULT FAVE'].includes(p.badge ?? ''),
  },
  {
    slug: 'sale',
    label: 'sale',
    blurb: 'get it before someone else does',
    bg: 'bg-pops-magenta',
    match: (p) => matches(p, 'sale'),
  },
  {
    slug: 'tops',
    label: 'tops',
    blurb: 'tees, hoodies & everything up top',
    bg: 'bg-pops-lime',
    match: (p) => matches(p, 'tops'),
  },
  {
    slug: 'bottoms',
    label: 'bottoms',
    blurb: 'cargos, skirts & the rest',
    bg: 'bg-pops-cyan',
    match: (p) => matches(p, 'bottoms'),
  },
  {
    slug: 'outerwear',
    label: 'outerwear',
    blurb: 'puffers, bombers, layers',
    bg: 'bg-pops-pink',
    match: (p) => matches(p, 'outerwear'),
  },
  {
    slug: 'footwear',
    label: 'footwear',
    blurb: 'stompers only',
    bg: 'bg-pops-yellow',
    match: (p) => matches(p, 'footwear'),
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
