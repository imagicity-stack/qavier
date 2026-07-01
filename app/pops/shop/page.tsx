import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/shopify';
import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { PopsProductCard } from '@/components/pops/pops-product-card';
import { Reveal } from '@/components/shared/reveal';
import { Marquee } from '@/components/shared/marquee';

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'The whole drop in one place. Filter by new arrivals, trending, best sellers and more. Loud, limited, yours.',
};

/**
 * Category definitions shared with the side menu (components/pops/pops-nav.tsx).
 * `women`/`men` map to the full line — the demo catalogue is unisex until real
 * gendered collections are wired up in Shopify.
 */
interface Cat {
  slug: string;
  label: string;
  blurb: string;
  match: (p: Product) => boolean;
}

const CATS: Cat[] = [
  { slug: 'all', label: 'shop all', blurb: "everything we've got, all in one chaotic place 🫠", match: () => true },
  { slug: 'women', label: 'women', blurb: 'the full line — styled for her', match: () => true },
  { slug: 'men', label: 'men', blurb: 'the full line — styled for him', match: () => true },
  { slug: 'new', label: 'new arrivals', blurb: 'fresh off the drop, still warm', match: (p) => p.tags.includes('new') },
  {
    slug: 'trending',
    label: 'trending',
    blurb: 'what everyone is copping rn',
    match: (p) => p.tags.some((t) => t === 'drop' || t === 'bestseller'),
  },
  {
    slug: 'bestsellers',
    label: 'best sellers',
    blurb: 'the hall of fame',
    match: (p) => p.tags.includes('bestseller') || ['BESTSELLER', 'CULT FAVE'].includes(p.badge ?? ''),
  },
  { slug: 'sale', label: 'sale', blurb: 'get it before someone else does', match: (p) => p.tags.includes('sale') },
  { slug: 'tops', label: 'tops', blurb: 'tees, hoodies & everything up top', match: (p) => p.tags.includes('tops') },
  { slug: 'bottoms', label: 'bottoms', blurb: 'cargos, skirts & the rest', match: (p) => p.tags.includes('bottoms') },
  { slug: 'outerwear', label: 'outerwear', blurb: 'puffers, bombers, layers', match: (p) => p.tags.includes('outerwear') },
  { slug: 'footwear', label: 'footwear', blurb: 'stompers only', match: (p) => p.tags.includes('footwear') },
];

// The chips shown on the page (curated subset; the full set lives in the menu).
const CHIP_SLUGS = ['all', 'new', 'trending', 'bestsellers', 'tops', 'bottoms', 'outerwear', 'footwear', 'sale'];

export default async function PopsShop({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const raw = typeof searchParams.c === 'string' ? searchParams.c : 'all';
  const active = CATS.find((c) => c.slug === raw) ?? CATS[0];

  const all = await getProducts({ universe: 'pops' });
  const products = all.filter(active.match);

  return (
    <div className="overflow-hidden">
      <section className="mx-auto max-w-7xl px-5 pt-28 sm:px-8">
        {/* Header */}
        <Reveal className="relative overflow-hidden rounded-pops border-2 border-pops-black bg-gradient-to-br from-pops-cyan via-pops-lime to-pops-yellow p-8 shadow-pops sm:p-12">
          <div className="grain pointer-events-none absolute inset-0 opacity-15" />
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 animate-floaty rounded-full bg-pops-magenta/40 blur-2xl" />
          <div className="relative z-10">
            <span className="pops-chip bg-pops-black text-pops-lime">✦ {active.slug === 'all' ? 'the full lineup' : 'filtered'}</span>
            <h1 className="mt-4 font-display text-6xl font-bold uppercase leading-[0.9] text-pops-black text-balance sm:text-7xl lg:text-8xl">
              {active.label}
            </h1>
            <p className="mt-4 flex flex-wrap items-center gap-3 font-sans text-lg text-pops-black/80">
              <span className="rounded-full border-2 border-pops-black bg-pops-paper px-4 py-1 font-display text-base font-bold uppercase">
                {products.length} {products.length === 1 ? 'piece' : 'pieces'}
              </span>
              <span>{active.blurb}</span>
            </p>
          </div>
        </Reveal>

        {/* Functional category chips */}
        <Reveal delay={0.1} className="scrollbar-none mt-8 flex gap-2.5 overflow-x-auto pb-1">
          {CHIP_SLUGS.map((slug) => {
            const cat = CATS.find((c) => c.slug === slug)!;
            const isActive = cat.slug === active.slug;
            return (
              <Link
                key={slug}
                href={slug === 'all' ? '/pops/shop' : `/pops/shop?c=${slug}`}
                className={cn(
                  'shrink-0 rounded-full border-2 border-pops-black px-5 py-2.5 font-display text-sm font-bold uppercase transition-transform hover:-translate-y-0.5',
                  isActive ? 'bg-pops-black text-pops-lime shadow-pops' : 'bg-pops-paper text-pops-black',
                )}
              >
                {cat.label}
              </Link>
            );
          })}
        </Reveal>

        {/* Product grid */}
        {products.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-4 pb-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p, i) => (
              <PopsProductCard key={p.id} product={p} index={i} priority={i < 4} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-pops border-2 border-dashed border-pops-black/40 bg-pops-cream p-12 text-center">
            <p className="font-display text-3xl font-bold uppercase text-pops-black">nothing here yet 🫠</p>
            <p className="mt-2 font-sans text-pops-black/60">this category is restocking. peep the rest of the drop.</p>
            <Link href="/pops/shop" className="pops-btn mt-6">
              shop everything ⚡
            </Link>
          </div>
        )}
      </section>

      {/* Bottom marquee flourish */}
      <div className="mt-16 border-y-2 border-pops-black bg-pops-magenta py-3.5 sm:mt-24">
        <Marquee reverse>
          {['THAT WAS THE DROP', '✦', 'BACK SOON WITH MORE', '★', 'JOIN THE LIST', '⚡'].map((w, i) => (
            <span
              key={i}
              className="mx-5 font-display text-xl font-bold uppercase tracking-tight text-white sm:text-2xl"
            >
              {w}
            </span>
          ))}
        </Marquee>
      </div>

      {/* Tiny closing nudge */}
      <section className="bg-pops-paper py-16 text-center">
        <Reveal className="mx-auto max-w-xl px-5">
          <h2 className="font-display text-4xl font-bold uppercase leading-none text-pops-black sm:text-5xl">
            seen enough?
          </h2>
          <p className="mt-3 font-sans text-pops-black/70">
            peep what&apos;s dropping next or take a breather over at qavier.
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
