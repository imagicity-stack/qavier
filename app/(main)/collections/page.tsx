import type { Metadata } from 'next';
import Link from 'next/link';
import { getCollections } from '@/lib/shopify';
import { CollectionTiles } from '@/components/store/collection-tiles';
import { Reveal } from '@/components/shared/reveal';
import { groupCollections } from '@/lib/nav';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Collections',
  description:
    'Every Qavier collection — capsules, essentials and seasonal drops, cut in small runs.',
};

export default async function CollectionsPage() {
  const collections = await getCollections();
  // Same bucketing the mega-menu uses, so a collection sits under the same
  // heading in the menu and on this page.
  const groups = groupCollections(collections);

  return (
    <div className="mx-auto max-w-[90rem] px-5 py-12 sm:px-8 sm:py-16">
      <Reveal>
        <p className="label">The wardrobe</p>
        <h1 className="h-page mt-3">Collections</h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/55">
          {collections.length > 0
            ? 'Every capsule in the house, from the core essentials to the seasonal drops.'
            : 'Collections appear here as they are published in Shopify.'}
        </p>
      </Reveal>

      {groups.length > 0 ? (
        <div className="mt-12 flex flex-col gap-14 sm:mt-16 sm:gap-20">
          {groups.map((group, i) => (
            <section key={group.heading}>
              <h2 className="h-section border-b border-line pb-4">{group.heading}</h2>
              <div className="mt-8">
                <CollectionTiles
                  priority={i === 0}
                  collections={collections.filter((c) =>
                    group.links.some((l) => l.href.endsWith(`/${c.handle}`)),
                  )}
                />
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-sm text-ink/50">
            No collections yet. Create one in Shopify and it appears here, in the
            menu and in the footer automatically.
          </p>
          <Link href="/shop" className="btn mt-8">
            Shop all pieces
          </Link>
        </div>
      )}
    </div>
  );
}
