import type { Metadata } from 'next';
import { getProducts } from '@/lib/shopify';
import { Reveal } from '@/components/shared/reveal';
import { LuxeProductCard } from '@/components/luxe/luxe-product-card';

export const metadata: Metadata = {
  title: 'The Collection',
  description:
    'The Atelier Collection — investment pieces in virgin wool, mulberry silk and grade-A cashmere, considered in every seam.',
};

export default async function CollectionPage() {
  const products = await getProducts({ universe: 'luxe' });

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-28 sm:px-10 sm:pt-32 lg:pb-32">
      {/* Editorial header */}
      <Reveal>
        <header className="max-w-3xl">
          <p className="luxe-label text-luxe-gold">The Atelier Collection</p>
          <h1 className="mt-6 font-serif text-5xl font-light leading-[1.05] text-luxe-noir text-balance sm:text-6xl">
            Pieces drawn for permanence.
          </h1>
          <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-luxe-charcoal/80">
            A small, deliberate wardrobe — each garment cut from the finest Italian cloth and
            hand-finished in the atelier. Nothing seasonal, nothing disposable. Only the pieces
            worth keeping.
          </p>
        </header>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mt-12 flex items-center justify-between border-t border-luxe-charcoal/15 pt-5">
          <span className="luxe-label text-luxe-stone">
            {products.length} {products.length === 1 ? 'Piece' : 'Pieces'}
          </span>
          <span className="luxe-label hidden text-luxe-stone sm:inline">Sorted — The Edit</span>
        </div>
      </Reveal>

      {/* Product grid */}
      <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-y-16 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, i) => (
          <Reveal key={product.id} delay={(i % 4) * 0.06}>
            <LuxeProductCard product={product} priority={i < 4} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
