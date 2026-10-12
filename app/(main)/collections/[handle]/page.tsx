import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCollection, getCollections } from '@/lib/shopify';
import { ShopImage } from '@/components/shared/shop-image';
import { ShopGrid } from '@/components/store/shop-grid';
import { CollectionTiles } from '@/components/store/collection-tiles';
import { SectionHead } from '@/components/store/section-head';
import { Reveal } from '@/components/shared/reveal';

export const revalidate = 60;

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
      collection.description.slice(0, 160) ||
      `Shop the ${collection.title} collection at Qavier.`,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: { handle: string };
}) {
  const [collection, allCollections] = await Promise.all([
    getCollection(params.handle, { sortKey: 'COLLECTION_DEFAULT' }),
    getCollections(),
  ]);

  if (!collection) notFound();

  const others = allCollections.filter((c) => c.handle !== collection.handle);
  const count = collection.products.length;

  return (
    <>
      {/* ——— Banner. A photograph when the collection has one, a mint band
             when it doesn't — never an empty grey box. ——— */}
      {collection.image ? (
        <section className="relative isolate flex min-h-[38svh] items-end overflow-hidden bg-ink sm:min-h-[46svh]">
          <ShopImage
            image={collection.image}
            priority
            sizes="100vw"
            className="absolute inset-0 h-full w-full"
            label={collection.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/35 to-ink/10" />
          <div className="relative mx-auto w-full max-w-[90rem] px-5 pb-10 pt-20 sm:px-8 sm:pb-14">
            <p className="font-display text-[0.65rem] font-bold uppercase tracking-wider2 text-mint-300">
              Collection
            </p>
            <h1 className="mt-3 font-display text-3xl font-extrabold uppercase leading-[1.03] tracking-[-0.015em] text-paper sm:text-4xl lg:text-5xl">
              {collection.title}
            </h1>
            {collection.description && (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-paper/75">
                {collection.description}
              </p>
            )}
          </div>
        </section>
      ) : (
        <section className="border-b border-line bg-shell">
          <div className="mx-auto max-w-[90rem] px-5 py-12 sm:px-8 sm:py-16">
            <p className="label">Collection</p>
            <h1 className="h-page mt-3">{collection.title}</h1>
            {collection.description && (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/55">
                {collection.description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ——— The grid ——— */}
      <section className="mx-auto max-w-[90rem] px-5 py-10 sm:px-8 sm:py-14">
        <p className="mb-6 text-sm text-ink/45">
          {count} {count === 1 ? 'piece' : 'pieces'}
        </p>

        {count > 0 ? (
          <ShopGrid products={collection.products} />
        ) : (
          <div className="py-16 text-center">
            <p className="text-sm text-ink/50">
              Nothing in this collection yet.
            </p>
            <Link href="/shop" className="btn mt-8">
              Shop all pieces
            </Link>
          </div>
        )}
      </section>

      {/* ——— Keep browsing ——— */}
      {others.length > 0 && (
        <section className="border-t border-line bg-shell">
          <div className="mx-auto max-w-[90rem] px-5 py-14 sm:px-8 sm:py-20">
            <Reveal>
              <SectionHead
                eyebrow="Keep looking"
                title="Other collections"
                href="/collections"
                linkLabel="All collections"
              />
            </Reveal>
            <div className="mt-8 sm:mt-10">
              <CollectionTiles collections={others.slice(0, 4)} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
