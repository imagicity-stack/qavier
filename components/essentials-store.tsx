import Link from 'next/link';
import { getProducts } from '@/lib/shopify';
import { PlaceholderFrame } from '@/components/shared/shop-image';
import { Reveal } from '@/components/shared/reveal';
import { TeeCard } from '@/components/home/tee-card';

const CATEGORIES = ['Tees', 'Hoodies', 'Sweatpants', 'Caps'];

const VALUES = [
  { title: 'Organic Cotton', body: 'Soft, breathable, responsibly sourced.' },
  { title: 'Built to Repeat', body: 'Pre-shrunk and colour-fast, wash after wash.' },
  { title: 'Everyday Comfort', body: 'True-to-size fits you reach for first.' },
];

/**
 * Qavier Essentials store, shown when NEXT_PUBLIC_ESSENTIALS_STORE=live.
 * A warm, minimal "everyday basics" storefront.
 */
export async function EssentialsStore() {
  const products = await getProducts({ universe: 'luxe' });
  const basics = products.filter((p) => p.tags.includes('t-shirts')).slice(0, 5);

  return (
    <div className="min-h-[100dvh] bg-[#EFE7D8] text-luxe-noir">
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 py-5 sm:px-10">
        <Link href="/" className="font-serif text-2xl tracking-[0.28em]" aria-label="Qavier worlds">
          QAVIER
        </Link>
        <span className="rounded-full border border-luxe-noir/25 px-3 py-1 font-sans text-[0.6rem] uppercase tracking-wider2 text-luxe-charcoal">
          Essentials
        </span>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-6 pb-10 pt-6 sm:px-10 lg:grid-cols-2 lg:gap-12 lg:pb-16">
        <Reveal className="flex flex-col justify-center">
          <p className="font-sans text-[0.7rem] uppercase tracking-luxe text-[#8a7d5f]">
            Everyday, Elevated
          </p>
          <h1 className="mt-5 font-sans text-5xl font-semibold uppercase leading-[0.95] tracking-tight sm:text-7xl">
            The
            <br />
            Essentials
          </h1>
          <p className="mt-6 max-w-sm font-sans text-base leading-relaxed text-luxe-charcoal/80">
            Quietly perfect basics, built to repeat. The everyday layer beneath
            everything you wear.
          </p>
          <Link
            href="#lineup"
            className="mt-9 inline-flex w-fit items-center gap-2 bg-luxe-noir px-8 py-4 font-sans text-[0.72rem] uppercase tracking-wider2 text-[#EFE7D8] transition-colors hover:bg-luxe-charcoal"
          >
            Shop Essentials
          </Link>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg lg:aspect-[5/4]">
            <PlaceholderFrame
              universe="luxe"
              className="absolute inset-0 h-full w-full"
              label="Essentials — The Basics"
            />
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/essentials-hero.png')" }}
            />
          </div>
        </Reveal>
      </section>

      {/* Category tiles */}
      <section className="mx-auto max-w-7xl px-6 py-6 sm:px-10">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c} delay={(i % 4) * 0.05}>
              <div className="group cursor-pointer">
                <div className="relative aspect-square overflow-hidden rounded-md">
                  <PlaceholderFrame
                    universe="luxe"
                    className="absolute inset-0 h-full w-full transition-transform duration-700 ease-luxe group-hover:scale-105"
                    label={c}
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-luxe-noir/50 to-transparent p-4">
                    <span className="font-sans text-sm font-semibold uppercase tracking-wider2 text-luxe-cream">
                      {c}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Line-up */}
      <section id="lineup" className="mx-auto max-w-7xl scroll-mt-8 px-6 py-14 sm:px-10">
        <Reveal className="mb-8 flex items-end justify-between border-b border-luxe-noir/10 pb-5">
          <h2 className="font-sans text-3xl font-semibold uppercase tracking-tight sm:text-4xl">
            The Line-Up
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
          {basics.map((product, i) => (
            <Reveal key={product.id} delay={(i % 5) * 0.05}>
              <TeeCard product={product} priority={i < 5} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-luxe-noir/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-10 sm:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06} className="text-center sm:text-left">
              <p className="font-sans text-[0.7rem] uppercase tracking-luxe text-[#8a7d5f]">
                0{i + 1}
              </p>
              <h3 className="mt-3 font-sans text-lg font-semibold uppercase tracking-tight">
                {v.title}
              </h3>
              <p className="mt-2 font-sans text-sm text-luxe-charcoal/75">{v.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <footer className="border-t border-luxe-noir/10 px-6 py-8 text-center sm:px-10">
        <Link
          href="/"
          className="font-sans text-[0.7rem] uppercase tracking-wider2 text-luxe-stone transition-colors hover:text-luxe-noir"
        >
          ← Back to Qavier
        </Link>
      </footer>
    </div>
  );
}
