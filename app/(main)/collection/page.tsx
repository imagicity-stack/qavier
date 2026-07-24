import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/shopify';
import { PlaceholderFrame } from '@/components/shared/shop-image';
import { Reveal } from '@/components/shared/reveal';
import { LuxeProductCard } from '@/components/luxe/luxe-product-card';

export const metadata: Metadata = {
  title: 'Collections',
  description:
    'Explore the Qavier collections. Designed for every moment, crafted to last.',
};

export default async function CollectionPage() {
  const products = await getProducts({ section: 'qavier' });
  const newIn = products.slice(0, 4);

  // Categories are derived from each product's Shopify "Type".
  const countByCategory = new Map<string, { label: string; count: number }>();
  for (const p of products) {
    const label = p.productType?.trim();
    if (!label) continue;
    const slug = label.toLowerCase();
    const entry = countByCategory.get(slug) ?? { label, count: 0 };
    entry.count += 1;
    countByCategory.set(slug, entry);
  }
  const categories = [...countByCategory.entries()].map(([slug, v]) => ({ slug, ...v }));

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-28 sm:px-10 sm:pt-32 lg:pb-32">
      {/* ——————————————————————————————————————————————————————
          Header
         —————————————————————————————————————————————————————— */}
      <Reveal>
        <header className="mx-auto max-w-2xl text-center">
          <p className="luxe-label text-luxe-stone">Qavier</p>
          <h1 className="mt-5 font-serif text-5xl font-light leading-[1.05] text-luxe-noir sm:text-6xl">
            Collections
          </h1>
          <p className="mt-5 font-sans text-base leading-relaxed text-luxe-charcoal/80">
            Designed for every moment, crafted to last.
          </p>
          <div className="luxe-rule mx-auto mt-10 max-w-xs" />
        </header>
      </Reveal>

      {/* ——————————————————————————————————————————————————————
          Category tabs
         —————————————————————————————————————————————————————— */}
      <Reveal delay={0.06}>
        <nav
          aria-label="Browse by category"
          className="scrollbar-none mt-10 flex justify-start gap-8 overflow-x-auto sm:justify-center"
        >
          <Link
            href="/shop"
            className="luxe-label shrink-0 whitespace-nowrap border-b border-transparent pb-2 text-luxe-noir transition-colors duration-500 ease-luxe hover:border-luxe-gold hover:text-luxe-gold"
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              className="luxe-label shrink-0 whitespace-nowrap border-b border-transparent pb-2 text-luxe-charcoal/70 transition-colors duration-500 ease-luxe hover:border-luxe-gold hover:text-luxe-gold"
            >
              {c.label}
            </Link>
          ))}
        </nav>
      </Reveal>

      {/* ——————————————————————————————————————————————————————
          Category cards
         —————————————————————————————————————————————————————— */}
      <Reveal delay={0.08}>
        <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-3">
          {categories.map((c) => (
            <Link key={c.slug} href={`/shop?category=${c.slug}`} className="group block">
              <PlaceholderFrame
                universe="luxe"
                className="aspect-[3/4] w-full overflow-hidden transition-transform duration-700 ease-luxe group-hover:scale-[1.02]"
                label={c.label}
              />
              <div className="mt-4 flex items-baseline justify-between">
                <h2 className="font-serif text-xl text-luxe-noir transition-colors duration-500 ease-luxe group-hover:text-luxe-gold sm:text-2xl">
                  {c.label}
                </h2>
                <span className="luxe-label text-luxe-stone">
                  {c.count} {c.count === 1 ? 'Piece' : 'Pieces'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>

      {/* ——————————————————————————————————————————————————————
          New In
         —————————————————————————————————————————————————————— */}
      <Reveal delay={0.05}>
        <div className="mt-24">
          <div className="mb-10 flex items-end justify-between border-b border-luxe-charcoal/10 pb-5">
            <h2 className="font-serif text-3xl font-light text-luxe-noir sm:text-4xl">New In</h2>
            <Link
              href="/shop"
              className="luxe-label text-luxe-charcoal transition-colors duration-500 ease-luxe hover:text-luxe-gold"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {newIn.map((product, i) => (
              <LuxeProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
