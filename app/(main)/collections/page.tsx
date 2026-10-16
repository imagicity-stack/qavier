import type { Metadata } from 'next';
import Link from 'next/link';
import { getCollections } from '@/lib/shopify';
import { ShopImage } from '@/components/shared/shop-image';
import { collectionHref } from '@/lib/nav';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Every Qavier collection — polos, tees, layers, golf and accessories.',
};

export default async function CollectionsPage() {
  const collections = (await getCollections()).filter((c) => c.hasProducts);

  return (
    <div className="pb-16">
      <header className="px-4 pb-9 pt-9 text-center sm:px-6 sm:pt-11">
        <h1 className="h-page">All Collections</h1>
      </header>

      {collections.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-9 px-2.5 sm:grid-cols-3 sm:px-4 lg:grid-cols-4 lg:px-6">
          {collections.map((c, i) => (
            <Link key={c.id} href={collectionHref(c.handle)} className="group block">
              <div className="relative aspect-square overflow-hidden bg-shell">
                <ShopImage
                  image={c.image}
                  priority={i < 4}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="absolute inset-0 h-full w-full transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
                  label={c.title}
                />
              </div>
              <div className="mt-4 text-center">
                <span className="label inline-block border-b-2 border-ink pb-1.5">{c.title}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="px-5 py-20 text-center">
          <p className="text-[0.95rem] text-mute">
            New collections are on their way — browse everything in the meantime.
          </p>
          <Link href="/shop" className="btn-dark mt-8">
            Shop All
          </Link>
        </div>
      )}
    </div>
  );
}
