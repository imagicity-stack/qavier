import Link from 'next/link';
import { ShopImage } from '@/components/shared/shop-image';
import type { CollectionSummary } from '@/lib/shopify/types';
import { collectionHref } from '@/lib/nav';
import { cn } from '@/lib/utils';

/**
 * Collection tiles — the store's shop-by-collection grid.
 *
 * Two up on phones so a thumb-scroll shows four at a time, four up on
 * desktop. Each tile borrows the collection's Shopify image, falling back to
 * its first product's photo (see `getCollections`), so a tile is never blank
 * just because nobody uploaded banner art.
 */
export function CollectionTiles({
  collections,
  columns = 4,
  priority = false,
}: {
  collections: CollectionSummary[];
  columns?: 3 | 4;
  priority?: boolean;
}) {
  if (!collections.length) return null;

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 sm:gap-5',
        columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4',
      )}
    >
      {collections.map((collection, i) => (
        <Link
          key={collection.id}
          href={collectionHref(collection.handle)}
          className="group relative block overflow-hidden rounded-2xl bg-shell"
        >
          <ShopImage
            image={collection.image}
            priority={priority && i < 2}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="aspect-[4/5] w-full transition-transform duration-[900ms] ease-soft group-hover:scale-[1.05]"
            label={collection.title}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <h3 className="font-display text-sm font-extrabold uppercase leading-tight tracking-wide text-paper sm:text-base">
              {collection.title}
            </h3>
            <span className="mt-1.5 inline-flex items-center gap-1.5 font-display text-[0.6rem] font-bold uppercase tracking-wider2 text-mint-300">
              Shop
              <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden>
                <path
                  d="M5 12h14m-5.5-6.5L20 12l-6.5 6.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
