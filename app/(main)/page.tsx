import Link from 'next/link';
import { getCollection, getCollections, getProducts } from '@/lib/shopify';
import { IntroSplash } from '@/components/intro-splash';
import { Hero } from '@/components/store/hero';
import { CategoryRail, type CategoryTile } from '@/components/store/category-rail';
import { ProductTabs } from '@/components/store/product-rail';
import { SplitBanners, WideBanner, type Editorial } from '@/components/store/editorial';
import { ValueProps } from '@/components/store/value-props';
import { collectionHref, typeHref } from '@/lib/nav';
import type { Image, Product } from '@/lib/shopify/types';

// Catalogue pages are regenerated at most this often, so Shopify price and
// stock edits reach the storefront without a redeploy. The /api/revalidate
// webhook flushes them immediately when Shopify pushes a change.
export const revalidate = 60;

/** The "Shop by Category" row, in this order, where the collection exists. */
const CATEGORIES: { title: string; handle: string }[] = [
  { title: 'New Arrivals', handle: 'new-arrivals' },
  { title: 'Polos', handle: 'mens-polos' },
  { title: 'Tees', handle: 'mens-t-shirts' },
  { title: 'Sweatshirts & Hoodies', handle: 'mens-sweatshirts-hoodies' },
  { title: 'Outerwear', handle: 'mens-outerwear' },
  { title: 'Bottoms', handle: 'mens-bottoms' },
  { title: 'Shirts', handle: 'mens-shirts' },
  { title: 'Accessories', handle: 'accessories' },
  { title: 'Kids', handle: 'kids' },
];

/** The rails after the editorial panels — the first two that exist. */
const RAILS: { title: string; handle: string }[] = [
  { title: 'The Golf Shop', handle: 'golf' },
  { title: 'For the Kids', handle: 'kids' },
  { title: 'On Sale', handle: 'sale' },
  { title: 'Accessories', handle: 'accessories' },
];

const QAVIER_CAMPAIGN: Image = {
  url: '/images/desktop_qavier.png',
  altText: 'Qavier campaign',
  width: 1586,
  height: 992,
};

const FABRIC: Image = {
  url: '/images/hero.webp',
  altText: 'Qavier fabric',
  width: 2000,
  height: 1131,
};

export default async function HomePage() {
  const [newest, bestSelling, collections] = await Promise.all([
    getProducts({ sortKey: 'CREATED_AT', reverse: true, first: 12 }),
    getProducts({ sortKey: 'BEST_SELLING', first: 12 }),
    getCollections(),
  ]);

  const byHandle = new Map(collections.map((c) => [c.handle, c]));
  const hrefFor = (handle: string, fallback = '/shop') =>
    byHandle.has(handle) ? collectionHref(handle) : fallback;

  const railSources = RAILS.filter((r) => byHandle.has(r.handle)).slice(0, 2);
  const rails = await Promise.all(
    railSources.map(async (r) => ({
      ...r,
      products: (await getCollection(r.handle, { first: 12, sortKey: 'BEST_SELLING' }))?.products ?? [],
    })),
  );

  const tiles = categoryTiles(byHandle, newest);

  // Men / Women panels when the store has those departments; otherwise the
  // two halves of the campaign lead to New Arrivals and Best Sellers.
  const panels: Editorial[] =
    byHandle.has('men') || byHandle.has('women')
      ? [
          {
            title: 'Shop Men',
            body: 'Polos, tees and the layers that go over them.',
            cta: 'Shop Men',
            href: hrefFor('men'),
            image: QAVIER_CAMPAIGN,
            position: '14% center',
          },
          {
            title: 'Shop Women',
            body: 'Polos, tees and easy sweats.',
            cta: 'Shop Women',
            href: hrefFor('women'),
            image: QAVIER_CAMPAIGN,
            position: '52% center',
          },
        ]
      : [
          {
            title: 'New Arrivals',
            body: 'The latest pieces, just in.',
            cta: 'Shop New',
            href: hrefFor('new-arrivals'),
            image: QAVIER_CAMPAIGN,
            position: '14% center',
          },
          {
            title: 'Best Sellers',
            body: 'The pieces our customers come back for.',
            cta: 'Shop Best Sellers',
            href: hrefFor('best-sellers'),
            image: QAVIER_CAMPAIGN,
            position: '52% center',
          },
        ];

  return (
    <>
      <IntroSplash />
      <Hero href={hrefFor('new-arrivals')} />

      {tiles.length > 1 && (
        <section className="pt-12 sm:pt-16 lg:px-10">
          <h2 className="h-section mb-8 text-center">Shop by Category</h2>
          <CategoryRail tiles={tiles} />
        </section>
      )}

      <ProductTabs
        title="Just Landed"
        tabs={[
          { label: 'New Arrivals', href: hrefFor('new-arrivals'), products: newest },
          { label: 'Best Sellers', href: hrefFor('best-sellers'), products: bestSelling },
        ]}
      />

      {newest.length > 0 && <SplitBanners items={panels} />}

      {rails[0] && rails[0].products.length > 0 && (
        <ProductTabs
          title={rails[0].title}
          tabs={[{ label: rails[0].title, href: collectionHref(rails[0].handle), products: rails[0].products }]}
        />
      )}

      <WideBanner
        item={{
          title: 'Made in Small Runs',
          body: 'Designed in-house, cut and finished in India.',
          cta: 'Our Story',
          href: '/about',
          image: FABRIC,
          position: 'center',
        }}
      />

      {rails[1] && rails[1].products.length > 0 && (
        <ProductTabs
          title={rails[1].title}
          tabs={[{ label: rails[1].title, href: collectionHref(rails[1].handle), products: rails[1].products }]}
        />
      )}

      {newest.length === 0 && (
        <section className="mx-auto max-w-xl px-5 py-24 text-center">
          <h2 className="h-section">The first pieces land soon</h2>
          <p className="mt-4 text-sm leading-relaxed text-mute">
            New pieces appear here as soon as they are published in Shopify.
          </p>
          <Link href="/about" className="btn mt-8">
            About Qavier
          </Link>
        </section>
      )}

      <div className="mt-4">
        <ValueProps />
      </div>
    </>
  );
}

/**
 * The "Shop by Category" tiles: the catalogue's category collections where
 * they exist; failing that, one tile per product type in the store, so the
 * row works before any collection has been created.
 */
function categoryTiles(
  byHandle: Map<string, { image: Image | null }>,
  products: Product[],
): CategoryTile[] {
  const fromCollections = CATEGORIES.flatMap(({ title, handle }) => {
    const c = byHandle.get(handle);
    if (!c) return [];
    // New Arrivals carries campaign art; a tile wants a product.
    const image = handle === 'new-arrivals' ? products[0]?.featuredImage ?? c.image : c.image;
    return [{ title, href: collectionHref(handle), image }];
  });
  if (fromCollections.length >= 3) return fromCollections;

  const byType = new Map<string, Product>();
  for (const p of products) {
    const type = p.productType?.trim();
    if (type && !byType.has(type.toLowerCase())) byType.set(type.toLowerCase(), p);
  }
  return Array.from(byType.values()).map((p) => ({
    title: p.productType!.trim(),
    href: typeHref(p.productType!.trim()),
    image: p.featuredImage,
  }));
}
