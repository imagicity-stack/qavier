import Link from 'next/link';
import { getProducts } from '@/lib/shopify';
import { PlaceholderFrame } from '@/components/shared/shop-image';
import { LuxeProductCard } from '@/components/luxe/luxe-product-card';

/**
 * Simple Qavier Luxe landing, shown when NEXT_PUBLIC_LUXE_STORE=live.
 * A dark editorial hero over a rail of the premium (non-tee) pieces.
 */
export async function LuxeLanding() {
  const products = (await getProducts({ section: 'luxe' })).slice(0, 6);

  return (
    <div className="min-h-[100dvh] bg-luxe-cream text-luxe-noir">
      <header className="flex items-center justify-between px-5 py-5 sm:px-10">
        <Link href="/" className="font-serif text-2xl tracking-[0.3em]" aria-label="Qavier worlds">
          QAVIER
        </Link>
        <span className="luxe-label text-luxe-gold">Luxe</span>
      </header>

      <section className="relative flex min-h-[62vh] items-end overflow-hidden">
        <PlaceholderFrame
          universe="luxe"
          className="absolute inset-0 h-full w-full"
          label="Luxe — The Atelier"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-luxe-cream via-luxe-cream/30 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-12 sm:px-10">
          <p className="luxe-label text-luxe-gold">Luxury Redefined</p>
          <h1 className="mt-4 font-serif text-5xl font-light leading-[1.02] sm:text-7xl">
            The Atelier Collection
          </h1>
          <p className="mt-5 max-w-md font-sans text-base text-luxe-charcoal/80">
            Investment pieces in virgin wool, mulberry silk and grade-A cashmere.
            Considered in every seam.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:py-20">
        <div className="mb-10 flex items-end justify-between border-b border-luxe-charcoal/10 pb-5">
          <h2 className="font-serif text-3xl font-light sm:text-4xl">The Collection</h2>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
          {products.map((product, i) => (
            <LuxeProductCard key={product.id} product={product} priority={i < 3} />
          ))}
        </div>
      </section>

      <footer className="border-t border-luxe-charcoal/10 px-6 py-8 text-center sm:px-10">
        <Link href="/" className="luxe-label text-luxe-stone transition-colors hover:text-luxe-noir">
          ← Back to Qavier
        </Link>
      </footer>
    </div>
  );
}
