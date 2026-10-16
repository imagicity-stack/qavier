import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCollection, getCollections } from '@/lib/shopify';
import { ShopGrid } from '@/components/store/shop-grid';
import { CategoryRail, type CategoryTile } from '@/components/store/category-rail';
import { buildNav, collectionHref, departmentFor } from '@/lib/nav';
import type { CollectionSummary } from '@/lib/shopify/types';

export const revalidate = 60;

/** The rail for collections that sit outside a department (New Arrivals, Sale…). */
const DEFAULT_RAIL = [
  'new-arrivals',
  'mens-polos',
  'mens-t-shirts',
  'mens-sweatshirts-hoodies',
  'mens-outerwear',
  'mens-pants',
];

const RAIL_LABELS: Record<string, string> = {
  'new-arrivals': 'New Arrivals',
  'mens-polos': 'Polos',
  'mens-t-shirts': 'Tees',
  'mens-sweatshirts-hoodies': 'Sweatshirts & Hoodies',
  'mens-outerwear': 'Outerwear',
  'mens-pants': 'Bottoms',
};

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const collection = await getCollection(params.handle, { first: 1 });
  if (!collection) return { title: 'Collection not found' };
  return {
    title: collection.title,
    description:
      collection.description.slice(0, 160) || `Shop the ${collection.title} collection at Qavier.`,
  };
}

export default async function CollectionPage({ params }: { params: { handle: string } }) {
  const [collection, collections] = await Promise.all([
    getCollection(params.handle, { sortKey: 'COLLECTION_DEFAULT' }),
    getCollections(),
  ]);

  if (!collection) notFound();

  const tiles = railFor(collection.handle, collections);

  return (
    <>
      <header className="px-4 pb-8 pt-9 text-center sm:px-6 sm:pt-11">
        <h1 className="h-page">{collection.title}</h1>
      </header>

      {tiles.length > 1 && (
        <div className="pb-9 lg:px-10 xl:px-[12%]">
          <CategoryRail tiles={tiles} activeHref={collectionHref(collection.handle)} />
        </div>
      )}

      <ShopGrid products={collection.products} />
    </>
  );
}

/**
 * The tiles above the grid: the department this collection belongs to —
 * its root first, then the department's first column — or a general set of
 * categories for a collection that stands alone. The current collection is
 * always in the row, so it can be boxed.
 */
function railFor(handle: string, collections: CollectionSummary[]): CategoryTile[] {
  const byHandle = new Map(collections.map((c) => [c.handle, c]));
  const department = departmentFor(handle, buildNav(collections));

  let entries: { title: string; handle: string }[];
  if (department?.groups?.length) {
    entries = department.groups[0].links.flatMap((link) => {
      const h = link.href.startsWith('/collections/') ? link.href.slice(13) : null;
      if (!h) return [];
      const title = h === department.href.slice(13) ? `All ${department.label}` : link.label;
      return [{ title, handle: h }];
    });
  } else {
    entries = DEFAULT_RAIL.map((h) => ({ title: RAIL_LABELS[h], handle: h }));
  }

  if (!entries.some((e) => e.handle === handle)) {
    const self = byHandle.get(handle);
    if (self) entries.unshift({ title: self.title, handle });
  }

  return entries.flatMap(({ title, handle: h }) => {
    const c = byHandle.get(h);
    return c ? [{ title, href: collectionHref(h), image: c.image }] : [];
  });
}
