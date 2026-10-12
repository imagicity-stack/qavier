import Link from 'next/link';
import { getCollections, getProducts } from '@/lib/shopify';
import { IntroSplash } from '@/components/intro-splash';
import { Hero } from '@/components/store/hero';
import { ValueProps } from '@/components/store/value-props';
import { SectionHead } from '@/components/store/section-head';
import { ProductRail } from '@/components/store/product-rail';
import { ProductCard } from '@/components/store/product-card';
import { CollectionTiles } from '@/components/store/collection-tiles';
import { PromoSplit } from '@/components/store/promo-split';
import { Newsletter } from '@/components/store/newsletter';
import { Reveal } from '@/components/shared/reveal';
import { collectionHref, findCollection } from '@/lib/nav';

// Catalogue pages are regenerated at most this often, so Shopify price and
// stock edits reach the storefront without a redeploy. The /api/revalidate
// webhook flushes them immediately when Shopify pushes a change.
export const revalidate = 60;

export default async function HomePage() {
  const [newest, bestSelling, collections] = await Promise.all([
    getProducts({ sortKey: 'CREATED_AT', reverse: true, first: 12 }),
    getProducts({ sortKey: 'BEST_SELLING', first: 12 }),
    getCollections(),
  ]);

  const newIn = findCollection(collections, ['new-arrival', 'new-in', 'new']);
  const newInHref = newIn ? collectionHref(newIn.handle) : '/shop';

  // Borrow a photograph for the editorial block: a collection's own art if
  // there is any, else the newest piece's second shot.
  const promoImage =
    collections.find((c) => c.image)?.image ??
    newest[0]?.images?.[1] ??
    newest[0]?.featuredImage ??
    null;

  // Best-sellers duplicating the "new in" rail wholesale looks like a bug, so
  // only run that band when it has something of its own to say.
  const newestIds = new Set(newest.slice(0, 8).map((p) => p.id));
  const alsoLoved = bestSelling.filter((p) => !newestIds.has(p.id));

  return (
    <>
      <IntroSplash />
      <Hero />
      <ValueProps />

      {/* ————————————————————————— New in ————————————————————————— */}
      {newest.length > 0 && (
        <section className="mx-auto max-w-[90rem] px-5 py-14 sm:px-8 sm:py-20">
          <Reveal>
            <SectionHead eyebrow="Just landed" title="New in" href={newInHref} />
          </Reveal>
          <div className="mt-8 sm:mt-10">
            <ProductRail products={newest} />
          </div>
        </section>
      )}

      {/* ———————————————————— Shop by collection ———————————————————— */}
      {collections.length > 0 && (
        <section className="border-t border-line bg-shell">
          <div className="mx-auto max-w-[90rem] px-5 py-14 sm:px-8 sm:py-20">
            <Reveal>
              <SectionHead
                eyebrow="The wardrobe"
                title="Shop by collection"
                href="/collections"
                linkLabel="All collections"
              />
            </Reveal>
            <div className="mt-8 sm:mt-10">
              <CollectionTiles collections={collections.slice(0, 8)} />
            </div>
          </div>
        </section>
      )}

      {/* ————————————————————————— Editorial ————————————————————————— */}
      <PromoSplit
        eyebrow="Made slowly"
        title="Cut in small runs"
        body="Every design is cut in a limited quantity, printed by hand and finished one at a time. When a run is gone, it is gone — there are no restocks and nothing is overproduced."
        href="/about"
        cta="About the house"
        image={promoImage}
      />

      {/* ————————————————————————— Best sellers ————————————————————————— */}
      {alsoLoved.length > 0 && (
        <section className="mx-auto max-w-[90rem] px-5 py-14 sm:px-8 sm:py-20">
          <Reveal>
            <SectionHead eyebrow="Tried and tested" title="Best sellers" href="/shop" />
          </Reveal>
          <div className="mt-8 sm:mt-10">
            <ProductRail products={alsoLoved} />
          </div>
        </section>
      )}

      {/* ————————————————————————— The full grid ————————————————————————— */}
      {newest.length > 4 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[90rem] px-5 py-14 sm:px-8 sm:py-20">
            <Reveal>
              <SectionHead
                eyebrow="Everything"
                title="The collection"
                href="/shop"
                linkLabel="Shop all"
              />
            </Reveal>
            <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-10 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-4">
              {newest.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {newest.length === 0 && (
        <section className="mx-auto max-w-xl px-5 py-24 text-center sm:px-8">
          <h2 className="h-section">The first pieces land soon</h2>
          <p className="mt-5 text-sm leading-relaxed text-ink/55">
            Connect the store to Shopify and the collection fills itself — the
            grid, the menu and the collection pages all read from it.
          </p>
          <Link href="/about" className="btn mt-9">
            About the house
          </Link>
        </section>
      )}

      <Newsletter />
    </>
  );
}
