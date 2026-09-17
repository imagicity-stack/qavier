import Link from 'next/link';
import { getProducts } from '@/lib/shopify';
import { IntroSplash } from '@/components/intro-splash';
import { Hero } from '@/components/store/hero';
import { ProductCard } from '@/components/store/product-card';
import { Reveal } from '@/components/shared/reveal';

// Catalogue pages are regenerated at most this often, so Shopify price and
// stock edits reach the storefront without a redeploy. The /api/revalidate
// webhook flushes them immediately when Shopify pushes a change.
export const revalidate = 60;

export default async function HomePage() {
  const products = await getProducts({ sortKey: 'CREATED_AT', reverse: true });
  const featured = products.slice(0, 8);

  return (
    <>
      <IntroSplash />
      <Hero />

      {/* ————————————————————————— The collection ————————————————————————— */}
      <section className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <p className="label">The collection</p>
            <h2 className="mt-4 font-display text-2xl font-light text-ink sm:text-3xl">
              Latest pieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="shrink-0 text-[0.65rem] uppercase tracking-wider2 text-ink/50 underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            View all
          </Link>
        </Reveal>

        {featured.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-sm text-ink/45">
            The first pieces land soon.
          </p>
        )}
      </section>

      {/* ————————————————————————— A quiet statement ————————————————————————— */}
      <section className="border-y border-line bg-shell">
        <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <Reveal>
            <p className="label">Made slowly</p>
            <p className="mt-6 font-display text-xl font-light leading-relaxed text-ink text-balance sm:text-2xl">
              Every piece is cut in a small run, printed by hand and finished one
              at a time. When a run is gone, it is gone.
            </p>
            <Link href="/about" className="btn-ghost mt-10">
              About the house
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
