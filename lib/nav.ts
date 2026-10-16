/**
 * The site's navigation.
 *
 * The menu is a fixed department tree — New Arrivals, Men, Women, Kids, Golf,
 * Accessories, Sale — each department a mega-menu of columns and two feature
 * tiles. Every link points at a Shopify collection by handle, so the menu is
 * the map of which collections the store should have (see the README's
 * "Collections → the menu" table).
 *
 * The tree is filtered against the collections that actually exist: a link
 * whose collection hasn't been created yet is dropped, a column with no links
 * left is dropped, and a department with nothing left is dropped. The menu
 * never offers an empty page. Any collection the tree doesn't mention is
 * still reachable, under a "Collections" department of its own.
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

export interface NavTile {
  title: string;
  href: string;
  image: Image | null;
}

export interface NavItem {
  label: string;
  href: string;
  /** Mega-menu columns. Absent for a plain link. */
  groups?: NavGroup[];
  /** Collection whose first products fill the right of the panel. */
  featured?: string;
  /** Image tiles pinned to the right of the panel, when it has no products. */
  tiles?: NavTile[];
  /** Set on Sale, so it can be drawn in the markdown colour. */
  accent?: boolean;
}

export const collectionHref = (handle: string) => `/collections/${handle}`;

/** A menu entry before it is checked against the store. */
interface MenuLink {
  label: string;
  /** Collection handle, or an absolute path starting with `/`. */
  to: string;
}

interface MenuItem {
  label: string;
  to: string;
  groups?: { heading: string; links: MenuLink[] }[];
  /** Collection handle whose products feature in the mega-menu. */
  featured?: string;
  tiles?: MenuLink[];
  accent?: boolean;
}

/**
 * The department tree. Handles here are the collection handles to create in
 * Shopify; the demo catalogue (`lib/demo`) defines every one of them.
 * `featured` names the collection whose first four products fill the right
 * half of the department's mega-menu.
 */
export const MENU: MenuItem[] = [
  {
    label: 'Men',
    to: 'men',
    featured: 'men',
    groups: [
      {
        heading: 'Clothing',
        links: [
          { label: 'Shop All', to: 'men' },
          { label: 'Polos', to: 'mens-polos' },
          { label: 'T-Shirts', to: 'mens-t-shirts' },
          { label: 'Sweatshirts & Hoodies', to: 'mens-sweatshirts-hoodies' },
          { label: 'Pants & Joggers', to: 'mens-pants' },
          { label: 'Shorts', to: 'mens-shorts' },
          { label: 'Swimwear', to: 'mens-swimwear' },
          { label: 'Outerwear', to: 'mens-outerwear' },
          { label: 'Golf', to: 'golf' },
          { label: 'Best Sellers', to: 'best-sellers' },
        ],
      },
      {
        heading: 'Accessories',
        links: [
          { label: 'Shop All', to: 'accessories' },
          { label: 'Hats & Caps', to: 'hats' },
          { label: 'Bags', to: 'bags' },
          { label: 'Socks', to: 'socks' },
          { label: 'Belts', to: 'belts' },
        ],
      },
    ],
  },
  {
    label: 'Women',
    to: 'women',
    featured: 'women',
    groups: [
      {
        heading: 'Clothing',
        links: [
          { label: 'Shop All', to: 'women' },
          { label: 'Polos', to: 'womens-polos' },
          { label: 'T-Shirts', to: 'womens-t-shirts' },
          { label: 'Sweatshirts & Hoodies', to: 'womens-sweatshirts-hoodies' },
          { label: 'Skirts & Pants', to: 'womens-bottoms' },
        ],
      },
      {
        heading: 'Accessories',
        links: [
          { label: 'Shop All', to: 'accessories' },
          { label: 'Hats & Caps', to: 'hats' },
          { label: 'Bags', to: 'bags' },
        ],
      },
    ],
  },
  {
    label: 'Kids',
    to: 'kids',
    featured: 'kids',
    groups: [
      {
        heading: 'Clothing',
        links: [
          { label: 'Shop All', to: 'kids' },
          { label: 'Polos', to: 'kids-polos' },
          { label: 'T-Shirts', to: 'kids-t-shirts' },
          { label: 'Sweatshirts & Hoodies', to: 'kids-sweatshirts-hoodies' },
          { label: 'Pants & Joggers', to: 'kids-pants' },
          { label: 'Matching Sets', to: 'matching-sets' },
        ],
      },
    ],
  },
  { label: 'New Arrivals', to: 'new-arrivals' },
  {
    label: 'Gifts',
    to: 'gifts',
    featured: 'gifts',
    groups: [
      {
        heading: 'Gifts',
        links: [
          { label: 'Shop All Gifts', to: 'gifts' },
          { label: 'Gifts Under ₹1,500', to: 'gifts-under-1500' },
          { label: 'Best Sellers', to: 'best-sellers' },
          { label: 'Accessories', to: 'accessories' },
        ],
      },
    ],
  },
  { label: 'Sale', to: 'sale', accent: true },
  {
    label: 'Discover',
    to: '/about',
    groups: [
      {
        heading: 'Discover',
        links: [
          { label: 'Our Story', to: '/about' },
          { label: 'The Golf Shop', to: 'golf' },
          { label: 'Size Guide', to: '/pages/size-guide' },
          { label: 'FAQs', to: '/pages/faq' },
        ],
      },
    ],
    tiles: [
      { label: 'Our Story', to: '/about' },
      { label: 'The Golf Shop', to: 'golf' },
    ],
  },
];

/** Art for menu tiles that point at a page rather than a collection. */
const PAGE_ART: Record<string, Image> = {
  '/about': {
    url: '/images/desktop_qavier.png',
    altText: 'Qavier campaign',
    width: 1586,
    height: 992,
  },
};

/** Every collection handle the menu refers to. */
const MENU_HANDLES = new Set(
  MENU.flatMap((item) => [
    item.to,
    ...(item.groups ?? []).flatMap((g) => g.links.map((l) => l.to)),
    ...(item.tiles ?? []).map((t) => t.to),
    ...(item.featured ? [item.featured] : []),
  ]).filter((to) => !to.startsWith('/')),
);

const SALE_HINTS = ['sale', 'outlet', 'clearance', 'markdown', 'last-chance'];

/** The first collection whose handle or title matches any hint, or undefined. */
export function findCollection(
  collections: CollectionSummary[],
  hints: string[],
): CollectionSummary | undefined {
  // Handle matches are more deliberate than title matches, so try those first.
  for (const hint of hints) {
    const byHandle = collections.find((c) => c.handle.toLowerCase().includes(hint));
    if (byHandle) return byHandle;
  }
  return collections.find((c) =>
    hints.some((h) => `${c.handle} ${c.title}`.toLowerCase().includes(h)),
  );
}

/**
 * The header's departments, filtered down to what the store can show.
 */
export function buildNav(collections: CollectionSummary[]): NavItem[] {
  const byHandle = new Map(collections.map((c) => [c.handle, c]));

  /** A menu link's href, or null when its collection doesn't exist. */
  const resolve = (to: string) =>
    to.startsWith('/') ? to : byHandle.has(to) ? collectionHref(to) : null;

  const items: NavItem[] = [];

  for (const entry of MENU) {
    const groups: NavGroup[] = (entry.groups ?? [])
      .map((g) => ({
        heading: g.heading,
        links: g.links.flatMap((l) => {
          const href = resolve(l.to);
          return href ? [{ label: l.label, href }] : [];
        }),
      }))
      .filter((g) => g.links.length > 0);

    const tiles: NavTile[] = (entry.tiles ?? []).flatMap((t) => {
      const href = resolve(t.to);
      if (!href) return [];
      return [{ title: t.label, href, image: byHandle.get(t.to)?.image ?? PAGE_ART[t.to] ?? null }];
    });

    const href = resolve(entry.to) ?? groups[0]?.links[0]?.href;
    if (!href) continue;

    items.push({
      label: entry.label,
      href,
      groups: groups.length ? groups : undefined,
      featured: entry.featured && byHandle.has(entry.featured) ? entry.featured : undefined,
      tiles: tiles.length ? tiles : undefined,
      accent: entry.accent,
    });
  }

  // Collections the tree doesn't know about stay reachable from the menu.
  const extras = collections.filter(
    (c) =>
      !MENU_HANDLES.has(c.handle) &&
      !SALE_HINTS.some((h) => c.handle.toLowerCase().includes(h)),
  );
  if (extras.length) {
    const entry: NavItem = {
      label: 'Collections',
      href: '/collections',
      groups: [
        {
          heading: 'Collections',
          links: extras.map((c) => ({ label: c.title, href: collectionHref(c.handle) })),
        },
      ],
    };
    // Before Sale, which always closes the bar.
    const saleIndex = items.findIndex((i) => i.accent);
    items.splice(saleIndex === -1 ? items.length : saleIndex, 0, entry);
  }

  return items;
}

/**
 * Breadcrumb trail for a collection: Home › Department › Collection.
 *
 * The department is the first menu item that lists the collection in one of
 * its columns, so "mens-polos" reads Home › Men › Polos.
 */
export function collectionTrail(handle: string, title: string): NavLink[] {
  const trail: NavLink[] = [{ label: 'Home', href: '/' }];
  const parent = MENU.find(
    (item) =>
      item.to !== handle &&
      item.groups?.some((g) => g.links.some((l) => l.to === handle)),
  );
  if (parent) trail.push({ label: parent.label, href: collectionHref(parent.to) });
  trail.push({ label: title, href: collectionHref(handle) });
  return trail;
}

/**
 * The department a collection belongs to — the menu item that is the
 * collection itself, or the first one listing it in a column.
 */
export function departmentFor(handle: string, nav: NavItem[]): NavItem | undefined {
  const href = collectionHref(handle);
  return (
    nav.find((item) => item.href === href && item.groups) ??
    nav.find((item) => item.groups?.[0]?.links.some((l) => l.href === href))
  );
}
