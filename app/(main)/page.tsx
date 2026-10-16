import Link from 'next/link';
import { getCollection, getCollections, getProducts } from '@/lib/shopify';
import { Hero } from '@/components/store/hero';
import { CategoryRail, type CategoryTile } from '@/components/store/category-rail';
import { ProductTabs } from '@/components/store/product-rail';
import { SplitBanners, WideBanner } from '@/components/store/editorial';
import { ValueProps } from '@/components/store/value-props';
import { collectionHref } from '@/lib/nav';
import type { CollectionSummary, Image } from '@/lib/shopify/types';

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
  { title: 'Bottoms', handle: 'mens-pants' },
  { title: 'Shorts', handle: 'mens-shorts' },
  { title: 'Accessories', handle: 'accessories' },
  { title: 'Kids', handle: 'kids' },
];

const campaign = (url: string, altText: string): Image => ({
  url,
  altText,
  width: 1586,
  height: 992,
});

export default async function HomePage() {
  const [newest, bestSelling, collections, golf, kids] = await Promise.all([
    getProducts({ sortKey: 'CREATED_AT', reverse: true, first: 12 }),
    getProducts({ sortKey: 'BEST_SELLING', first: 12 }),
    getCollections(),
    getCollection('golf', { first: 12, sortKey: 'BEST_SELLING' }),
    getCollection('kids', { first: 12, sortKey: 'BEST_SELLING' }),
  ]);

  const byHandle = new Map(collections.map((c) => [c.handle, c]));
  const hrefFor = (handle: string, fallback = '/shop') =>
    byHandle.has(handle) ? collectionHref(handle) : fallback;

  const tiles: CategoryTile[] = CATEGORIES.flatMap(({ title, handle }) => {
    const c: CollectionSummary | undefined = byHandle.get(handle);
    // The New Arrivals collection carries campaign art; a tile wants a
    // product, so take the first piece's photo instead.
    const image = handle === 'new-arrivals' ? newest[0]?.featuredImage ?? null : c?.image ?? null;
    return c ? [{ title, href: collectionHref(handle), image }] : [];
  });

  return (
    <>
      <Hero href={hrefFor('new-arrivals')} />

      {tiles.length > 0 && (
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

      {(byHandle.has('men') || byHandle.has('women')) && (
        <SplitBanners
          items={[
            {
              title: 'Shop Men',
              body: 'Polos, tees and the layers that go over them.',
              cta: 'Shop Men',
              href: hrefFor('men'),
              image: campaign('/images/desktop_qavier.png', 'Qavier menswear campaign'),
              position: '28% center',
            },
            {
              title: 'Shop Women',
              body: 'Cropped polos, baby tees and easy sweats.',
              cta: 'Shop Women',
              href: hrefFor('women'),
              image: campaign('/images/desktop_essentials.png', 'Qavier womenswear campaign'),
              position: '50% center',
            },
          ]}
        />
      )}

      {golf && golf.products.length > 0 && (
        <ProductTabs
          title="The Golf Shop"
          tabs={[{ label: 'Golf', href: collectionHref('golf'), products: golf.products }]}
        />
      )}

      <WideBanner
        item={{
          title: 'Colour, Turned Up',
          body: 'Bright layers for long weekends.',
          cta: 'Shop the Edit',
          href: hrefFor('new-arrivals'),
          image: campaign('/images/desktop_pops.png', 'Qavier colour campaign'),
          position: '35% center',
        }}
      />

      {kids && kids.products.length > 0 && (
        <ProductTabs
          title="For the Kids"
          tabs={[{ label: 'Kids', href: collectionHref('kids'), products: kids.products }]}
        />
      )}

      {newest.length === 0 && (
        <section className="mx-auto max-w-xl px-5 py-24 text-center">
          <h2 className="h-section">The first pieces land soon</h2>
          <p className="mt-4 text-sm leading-relaxed text-mute">
            Connect the store to Shopify and the collection fills itself — the grid, the menu
            and the collection pages all read from it.
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
