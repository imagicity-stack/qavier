/**
 * The site's navigation.
 *
 * The menu is a fixed department tree — Men, Women, Kids, New Arrivals, Gifts,
 * Sale, Discover — each department a mega-menu of link columns with four
 * featured products beside them. Every link points at a collection from the
 * catalogue (`lib/catalog/collections.json`) by handle;
 * `scripts/create-collections.mjs` creates them all in Shopify.
 *
 * The tree is checked against the collections that actually exist: a link
 * whose collection hasn't been created is dropped, an empty column is dropped,
 * and an empty department is dropped — the menu never offers an empty page.
 * Collections the tree doesn't mention still appear, in Discover's
 * Collections column. And a store with no Men / Women / Kids collections at
 * all gets a Shop department built from its product types instead, so there
 * is always a way into the catalogue.
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
  /** CSS object-position for the crop, to keep the subject in frame. */
  position?: string;
}

export interface NavItem {
  label: string;
  href: string;
  /** The department's own collection handle, when it has one. */
  root?: string;
  /** Mega-menu columns. Absent for a plain link. */
  groups?: NavGroup[];
  /**
   * What fills the right half of the panel: a collection handle, or
   * `NEWEST` for the newest products in the store.
   */
  featured?: string;
  /** Image tiles for the right of the panel, when it has no products. */
  tiles?: NavTile[];
  /** Set on Sale, so it can be drawn in the markdown colour. */
  accent?: boolean;
}

/** `featured` value meaning "the newest products in the store". */
export const NEWEST = '__newest__';

export const collectionHref = (handle: string) => `/collections/${handle}`;

/**
 * The shop page filtered to one product type. The type keeps Shopify's own
 * spelling, so the search the page sends matches it exactly.
 */
export const typeHref = (type: string) => `/shop?category=${encodeURIComponent(type.trim())}`;

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

const ACCESSORIES: MenuLink[] = [
  { label: 'Shop All', to: 'accessories' },
  { label: 'Hats & Caps', to: 'hats-caps' },
  { label: 'Bags & Wallets', to: 'bags-wallets' },
  { label: 'Socks', to: 'socks' },
  { label: 'Belts', to: 'belts' },
];

/**
 * The department tree. Every handle here is defined in
 * `lib/catalog/collections.json`.
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
          { label: 'Bottoms', to: 'mens-bottoms' },
          { label: 'Big & Tall', to: 'big-and-tall' },
          { label: 'Swimwear', to: 'mens-swimwear' },
          { label: 'Matching Sets', to: 'mens-matching-sets' },
          { label: 'Sweaters & Knits', to: 'mens-sweaters-knits' },
          { label: 'Outerwear', to: 'mens-outerwear' },
          { label: 'Shirts', to: 'mens-shirts' },
          { label: 'Golf', to: 'golf' },
          { label: 'Best Sellers', to: 'best-sellers' },
        ],
      },
      { heading: 'Accessories', links: ACCESSORIES },
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
          { label: 'Bottoms', to: 'womens-bottoms' },
          { label: 'Outerwear', to: 'womens-outerwear' },
        ],
      },
      { heading: 'Accessories', links: ACCESSORIES },
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
          { label: 'Swimwear', to: 'kids-swimwear' },
          { label: 'Bottoms', to: 'kids-bottoms' },
          { label: 'Matching Sets', to: 'kids-matching-sets' },
          { label: 'Outerwear', to: 'kids-outerwear' },
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
          { label: 'All Collections', to: '/collections' },
        ],
      },
    ],
    tiles: [
      { label: 'Our Story', to: '/about' },
      { label: 'The Golf Shop', to: 'golf' },
    ],
  },
];

/** The departments whose absence triggers the product-type Shop menu. */
const GENDER_DEPARTMENTS = ['men', 'women', 'kids'];

/** Art for menu tiles that point at a page rather than a collection. */
const PAGE_ART: Record<string, Image & { position?: string }> = {
  '/about': {
    url: '/images/desktop_qavier.png',
    altText: 'Qavier campaign',
    width: 1586,
    height: 992,
    // The photo carries the wordmark on its right; crop to the people.
    position: '22% center',
  },
};

/**
 * Handles listed by more than one department — Accessories, Best Sellers,
 * Golf. They can fill a department's columns but never stand in for the
 * department itself: a Women menu holding only the shared Accessories column
 * would open on Accessories.
 */
const SHARED_HANDLES = (() => {
  const seen = new Map<string, number>();
  for (const item of MENU) {
    const handles = new Set(
      (item.groups ?? []).flatMap((g) => g.links.map((l) => l.to)).filter((to) => to !== item.to),
    );
    handles.forEach((h) => seen.set(h, (seen.get(h) ?? 0) + 1));
  }
  return new Set(Array.from(seen).filter(([, n]) => n > 1).map(([h]) => h));
})();

/**
 * The header's departments, filtered down to what the store can show.
 *
 * Pass only collections that hold products — an empty smart collection is
 * treated as missing. `productTypes` are the types in the catalogue, used for
 * the Shop department when the store has no gender departments.
 */
export function buildNav(collections: CollectionSummary[], productTypes: string[] = []): NavItem[] {
  const byHandle = new Map(collections.map((c) => [c.handle, c]));

  /** A menu link's href, or null when its collection doesn't exist. */
  const resolve = (to: string) => {
    // The collections index is only worth a link when it has something on it.
    if (to === '/collections') return collections.length ? to : null;
    return to.startsWith('/') ? to : byHandle.has(to) ? collectionHref(to) : null;
  };

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
      const art = PAGE_ART[t.to];
      return [
        {
          title: t.label,
          href,
          image: byHandle.get(t.to)?.image ?? art ?? null,
          position: byHandle.has(t.to) ? undefined : art?.position,
        },
      ];
    });

    // A department opens on its own collection, or failing that on the first
    // link of its own first column that isn't shared with another department.
    const own = (entry.groups?.[0]?.links ?? []).find(
      (l) => !SHARED_HANDLES.has(l.to) && resolve(l.to),
    );
    const href = resolve(entry.to) ?? (own ? resolve(own.to) : null);
    if (!href) continue;

    items.push({
      label: entry.label,
      href,
      root: !entry.to.startsWith('/') && byHandle.has(entry.to) ? entry.to : undefined,
      groups: groups.length ? groups : undefined,
      featured: entry.featured && byHandle.has(entry.featured) ? entry.featured : undefined,
      tiles: tiles.length ? tiles : undefined,
      accent: entry.accent,
    });
  }

  // No gender departments at all: a Shop department from the product types,
  // so the catalogue is always one hover away.
  const hasDepartment = GENDER_DEPARTMENTS.some((h) => byHandle.has(h));
  if (!hasDepartment) {
    // Product types are free text, so "T-Shirts" and "T-shirts" both turn up;
    // keep the first spelling of each.
    const byKey = new Map<string, string>();
    for (const raw of productTypes) {
      const t = raw.trim();
      if (t && !byKey.has(t.toLowerCase())) byKey.set(t.toLowerCase(), t);
    }
    const types = Array.from(byKey.values()).sort((a, b) => a.localeCompare(b));
    items.unshift({
      label: 'Shop',
      href: '/shop',
      featured: NEWEST,
      groups: [
        {
          heading: 'Clothing',
          links: [
            { label: 'Shop All', href: '/shop' },
            ...types.map((t) => ({ label: t, href: typeHref(t) })),
          ],
        },
      ],
    });
  }

  // New Arrivals is a fixture of the bar; without the collection it is the
  // whole catalogue, newest first — which is what /shop already shows. (The
  // query keeps it from lighting up alongside Shop on /shop.)
  if (!items.some((i) => i.label === 'New Arrivals')) {
    const at = items.findIndex((i) => i.label === 'Gifts' || i.accent || i.label === 'Discover');
    items.splice(at === -1 ? items.length : at, 0, {
      label: 'New Arrivals',
      href: '/shop?sort=newest',
    });
  }

  // Every collection the menu doesn't already link — ones the tree doesn't
  // name, and shared ones (Accessories, Best Sellers) left without a
  // department — goes in Discover's Collections column, so nothing live is
  // unreachable.
  const linked = new Set(
    items.flatMap((i) => [
      i.href,
      ...(i.groups ?? []).flatMap((g) => g.links.map((l) => l.href)),
      ...(i.tiles ?? []).map((t) => t.href),
    ]),
  );
  const extras = collections.filter((c) => !linked.has(collectionHref(c.handle)));
  const discover = items.find((i) => i.label === 'Discover');
  if (extras.length && discover?.groups) {
    discover.groups.push({
      heading: 'Collections',
      links: extras.map((c) => ({ label: c.title, href: collectionHref(c.handle) })),
    });
  }

  return items;
}

/**
 * The menu column a collection belongs to, with its department.
 *
 * Preference, most specific first: the column the collection heads (its
 * "Shop All" — Accessories for /collections/accessories); the department
 * the collection *is* (its first column); then the first column that lists
 * it anywhere.
 */
export function departmentFor(
  handle: string,
  nav: NavItem[],
): { department: NavItem; group: NavGroup } | undefined {
  const href = collectionHref(handle);
  for (const department of nav) {
    const group = department.groups?.find((g) => g.links[0]?.href === href);
    if (group) return { department, group };
  }
  const self = nav.find((item) => item.root === handle && item.groups?.length);
  if (self) return { department: self, group: self.groups![0] };
  for (const department of nav) {
    const group = department.groups?.find((g) => g.links.some((l) => l.href === href));
    if (group) return { department, group };
  }
  return undefined;
}
