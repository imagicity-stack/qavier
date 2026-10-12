/**
 * The site's navigation, built from the store's own Shopify collections.
 *
 * Nothing here is a hardcoded category list. Add a collection in Shopify and
 * it appears in the mega-menu, the mobile drawer and the collections index on
 * the next revalidation — there is no second place to edit.
 *
 * Collections are bucketed into columns by keyword so the menu reads as a
 * menu (Clothing / Featured / Collections) instead of one long alphabetical
 * list. A collection that matches nothing lands in "Collections", which is
 * the right home for a capsule or a collab.
 */
import type { CollectionSummary, Image } from './shopify/types';

export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  heading: string;
  links: NavLink[];
}

export interface NavFeature {
  title: string;
  caption: string;
  href: string;
  image: Image | null;
}

export interface NavItem {
  label: string;
  href: string;
  /** Mega-menu columns. Absent for a plain link. */
  groups?: NavGroup[];
  /** Image tile pinned to the right of the panel. */
  feature?: NavFeature;
  /** Set on Sale, so it can be drawn in the markdown colour. */
  accent?: boolean;
}

/** Keyword buckets. First match wins, so order matters within each list. */
const CLOTHING_HINTS = [
  'tee',
  't-shirt',
  'tshirt',
  'shirt',
  'polo',
  'hood',
  'sweat',
  'crew',
  'jacket',
  'outer',
  'bottom',
  'short',
  'jogger',
  'trouser',
  'pant',
  'cargo',
  'denim',
  'upper',
  'knit',
];

const FEATURED_HINTS = [
  'new',
  'best',
  'arrival',
  'essential',
  'signature',
  'core',
  'icon',
  'drop',
  'season',
];

const SALE_HINTS = ['sale', 'outlet', 'clearance', 'markdown', 'last-chance'];

const NEW_HINTS = ['new-arrival', 'new-in', 'newest', 'new'];

const BEST_HINTS = ['best-sell', 'bestsell', 'best-seller', 'popular', 'top'];

const matches = (c: CollectionSummary, hints: string[]) => {
  const hay = `${c.handle} ${c.title}`.toLowerCase();
  return hints.some((h) => hay.includes(h));
};

/** The first collection matching any hint, or undefined. */
export function findCollection(
  collections: CollectionSummary[],
  hints: string[],
): CollectionSummary | undefined {
  // Handle matches are more deliberate than title matches, so try those first.
  for (const hint of hints) {
    const byHandle = collections.find((c) => c.handle.toLowerCase().includes(hint));
    if (byHandle) return byHandle;
  }
  return collections.find((c) => matches(c, hints));
}

export const collectionHref = (handle: string) => `/collections/${handle}`;

const toLink = (c: CollectionSummary): NavLink => ({
  label: c.title,
  href: collectionHref(c.handle),
});

/**
 * Sort collections into the mega-menu's columns.
 *
 * Exported because the collections index groups them under the same headings —
 * the menu and the page can't disagree about where a collection belongs.
 */
export function groupCollections(collections: CollectionSummary[]): NavGroup[] {
  const clothing: CollectionSummary[] = [];
  const featured: CollectionSummary[] = [];
  const rest: CollectionSummary[] = [];

  for (const c of collections) {
    if (matches(c, SALE_HINTS)) continue; // Sale has its own top-level entry.
    if (matches(c, CLOTHING_HINTS)) clothing.push(c);
    else if (matches(c, FEATURED_HINTS)) featured.push(c);
    else rest.push(c);
  }

  return [
    { heading: 'Clothing', links: clothing.map(toLink) },
    { heading: 'Featured', links: featured.map(toLink) },
    { heading: 'Collections', links: rest.map(toLink) },
  ].filter((g) => g.links.length > 0);
}

/**
 * The header's top-level items.
 *
 * `/shop` is always present as the catch-all — it lists the whole catalogue
 * and needs no collection to exist. Everything else only appears when the
 * store actually has something behind it, so the menu never offers an empty
 * page.
 */
export function buildNav(collections: CollectionSummary[]): NavItem[] {
  const groups = groupCollections(collections);
  const newIn = findCollection(collections, NEW_HINTS);
  const best = findCollection(collections, BEST_HINTS);
  const sale = findCollection(collections, SALE_HINTS);

  const shopBy: NavLink[] = [{ label: 'All pieces', href: '/shop' }];
  if (newIn) shopBy.push({ label: 'New arrivals', href: collectionHref(newIn.handle) });
  if (best) shopBy.push({ label: 'Best sellers', href: collectionHref(best.handle) });
  if (collections.length) shopBy.push({ label: 'All collections', href: '/collections' });
  if (sale) shopBy.push({ label: 'Sale', href: collectionHref(sale.handle) });

  // The tile at the right of the Shop panel: whatever we can show a photo of.
  const featureSource = newIn ?? collections.find((c) => c.image) ?? collections[0];
  const feature: NavFeature | undefined = featureSource
    ? {
        title: featureSource.title,
        caption: 'Shop the collection',
        href: collectionHref(featureSource.handle),
        image: featureSource.image,
      }
    : undefined;

  const items: NavItem[] = [];

  if (newIn) items.push({ label: 'New In', href: collectionHref(newIn.handle) });

  items.push({
    label: 'Shop',
    href: '/shop',
    groups: [{ heading: 'Shop by', links: shopBy }, ...groups],
    feature,
  });

  if (collections.length > 1) {
    items.push({
      label: 'Collections',
      href: '/collections',
      groups,
      feature,
    });
  }

  if (sale) {
    items.push({ label: 'Sale', href: collectionHref(sale.handle), accent: true });
  }

  items.push({ label: 'About', href: '/about' });

  return items;
}
