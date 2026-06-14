import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/shopify';
import { PopsProductCard } from '@/components/pops/pops-product-card';
import { Reveal } from '@/components/shared/reveal';
import { Marquee } from '@/components/shared/marquee';

export const metadata: Metadata = {
  title: 'Shop All',
  description:
    'The whole drop in one place. Hyperpop cargos, glitchcore tees, iridescent everything. Loud, limited, yours.',
};

// Presentational-only chip row (no filtering wired up — visual flavor).
const CATEGORY_CHIPS = [
  { label: 'everything', bg: 'bg-pops-black text-pops-lime' },
  { label: 'tops', bg: 'bg-pops-paper text-pops-black' },
  { label: 'bottoms', bg: 'bg-pops-paper text-pops-black' },
  { label: 'outerwear', bg: 'bg-pops-paper text-pops-black' },
  { label: 'footwear', bg: 'bg-pops-paper text-pops-black' },
  { label: 'new in', bg: 'bg-pops-paper text-pops-black' },
];

export default async function PopsShop() {
  const products = await getProducts({ universe: 'pops' });

  return (
    <div className="overflow-hidden">
      <section className="mx-auto max-w-7xl px-5 pt-28 sm:px-8">
        {/* Header */}
        <Reveal className="relative overflow-hidden rounded-pops border-2 border-pops-black bg-gradient-to-br from-pops-cyan via-pops-lime to-pops-yellow p-8 shadow-pops sm:p-12">
          <div className="grain pointer-events-none absolute inset-0 opacity-15" />
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 animate-floaty rounded-full bg-pops-magenta/40 blur-2xl" />
          <div className="relative z-10">
            <span className="pops-chip bg-pops-black text-pops-lime">✦ the full lineup</span>
            <h1 className="mt-4 font-display text-6xl font-bold uppercase leading-[0.9] text-pops-black text-balance sm:text-7xl lg:text-8xl">
              shop all
            </h1>
            <p className="mt-4 flex flex-wrap items-center gap-3 font-sans text-lg text-pops-black/80">
              <span className="rounded-full border-2 border-pops-black bg-pops-paper px-4 py-1 font-display text-base font-bold uppercase">
                {products.length} pieces
              </span>
              <span>everything we&apos;ve got, all in one chaotic place. happy hunting 🫠</span>
            </p>
          </div>
        </Reveal>

        {/* Static category chip row (presentational) */}
        <Reveal
          delay={0.1}
          className="scrollbar-none mt-8 flex gap-2.5 overflow-x-auto pb-1"
        >
          {CATEGORY_CHIPS.map((c) => (
            <span
              key={c.label}
              className={`shrink-0 rounded-full border-2 border-pops-black px-5 py-2.5 font-display text-sm font-bold uppercase shadow-pops ${c.bg}`}
            >
              {c.label}
            </span>
          ))}
        </Reveal>

        {/* Product grid */}
        <Reveal
          delay={0.15}
          className="mt-8 grid grid-cols-2 gap-4 pb-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
        >
          {products.map((p, i) => (
            <PopsProductCard key={p.id} product={p} index={i} priority={i < 4} />
          ))}
        </Reveal>
      </section>

      {/* Bottom marquee flourish */}
      <div className="mt-16 border-y-2 border-pops-black bg-pops-magenta py-3.5 sm:mt-24">
        <Marquee reverse>
          {['THAT WAS THE DROP', '✦', 'BACK SOON WITH MORE', '★', 'JOIN THE LIST', '⚡'].map(
            (w, i) => (
              <span
                key={i}
                className="mx-5 font-display text-xl font-bold uppercase tracking-tight text-white sm:text-2xl"
              >
                {w}
              </span>
            ),
          )}
        </Marquee>
      </div>

      {/* Tiny closing nudge */}
      <section className="bg-pops-paper py-16 text-center">
        <Reveal className="mx-auto max-w-xl px-5">
          <h2 className="font-display text-4xl font-bold uppercase leading-none text-pops-black sm:text-5xl">
            seen enough?
          </h2>
          <p className="mt-3 font-sans text-pops-black/70">
            peep what&apos;s dropping next or take a breather in luxe.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/pops/drops" className="pops-btn">
              upcoming drops ⚡
            </Link>
            <Link
              href="/pops"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-pops-black bg-pops-paper px-7 py-3.5 font-display text-base font-bold uppercase text-pops-black transition-transform hover:-translate-y-0.5"
            >
              back home ⟵
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
