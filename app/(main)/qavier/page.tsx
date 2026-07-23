import Link from 'next/link';
import { getProducts } from '@/lib/shopify';
import { PlaceholderFrame } from '@/components/shared/shop-image';
import { Reveal } from '@/components/shared/reveal';
import { TeeCard } from '@/components/home/tee-card';
import { LUXE_LIVE, POPS_LIVE } from '@/lib/config';

const FEATURES = [
  { title: 'Premium Quality', sub: 'Finest Fabrics', Icon: BoxIcon },
  { title: 'Secure Payments', sub: '100% Protected', Icon: ShieldIcon },
  { title: 'Easy Returns', sub: 'Hassle Free', Icon: ReturnIcon },
  { title: 'Worldwide Shipping', sub: 'Delivering Elegance', Icon: GlobeIcon },
];

export default async function QavierHome() {
  const products = await getProducts({ universe: 'luxe' });
  const tees = products.filter((p) => p.tags.includes('t-shirts')).slice(0, 5);

  return (
    <>
      {/* ————————————————————————————————————————————————
          HERO — T-Shirts collection
         ———————————————————————————————————————————————— */}
      <section className="border-b border-luxe-charcoal/10 pt-20 sm:pt-24">
        <div className="mx-auto grid max-w-7xl items-stretch gap-8 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:py-14">
          <Reveal className="flex flex-col justify-center">
            <p className="font-sans text-[0.7rem] uppercase tracking-luxe text-luxe-gold">
              Effortless. Everyday. Exceptional.
            </p>
            <h1 className="mt-5 font-serif text-5xl font-light leading-[1.02] text-luxe-noir sm:text-6xl">
              T-Shirts
              <br />
              Collection
            </h1>
            <div className="mt-6 h-px w-16 bg-luxe-gold/70" />
            <p className="mt-6 max-w-sm font-sans text-base leading-relaxed text-luxe-charcoal/80">
              Premium fabrics. Timeless fits.
              <br />
              Made for every you.
            </p>
            <Link href="/shop" className="luxe-btn mt-9 self-start">
              Explore Collection
            </Link>
          </Reveal>

          <Reveal delay={0.08} className="relative">
            {/* Hero image — drop /images/tshirt-hero.png into public/images to use it. */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg lg:aspect-auto lg:h-full">
              <PlaceholderFrame
                universe="luxe"
                className="absolute inset-0 h-full w-full"
                label="Campaign — The Tee"
              />
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/tshirt-hero.png')" }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ————————————————————————————————————————————————
          PRODUCT RAIL
         ———————————————————————————————————————————————— */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 font-sans text-[0.7rem] uppercase tracking-wider2 text-luxe-charcoal">
              <FilterIcon className="h-3.5 w-3.5" /> Filter
            </span>
            <span className="hidden font-sans text-[0.7rem] uppercase tracking-wider2 text-luxe-stone sm:inline">
              Sort by: <span className="text-luxe-noir">Featured ▾</span>
            </span>
          </div>
          <Link
            href="/shop"
            className="font-sans text-[0.7rem] uppercase tracking-wider2 text-luxe-charcoal underline-offset-4 transition-colors hover:text-luxe-gold hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
          {tees.map((product, i) => (
            <Reveal key={product.id} delay={(i % 5) * 0.05}>
              <TeeCard product={product} priority={i < 5} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ————————————————————————————————————————————————
          THE TWO UNIVERSES — Luxe (coming soon) & Pops (live)
         ———————————————————————————————————————————————— */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        {/* LUXE — coming soon */}
        <div className="relative flex min-h-[300px] items-center overflow-hidden bg-luxe-noir px-8 py-16 sm:px-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                'radial-gradient(70% 60% at 20% 30%, rgba(201,169,106,0.18), transparent 70%)',
            }}
          />
          <Reveal className="relative z-10">
            <p className="font-sans text-[0.65rem] uppercase tracking-luxe text-luxe-champagne">
              Luxury Redefined
            </p>
            <h2 className="mt-4 font-serif text-5xl font-light text-luxe-cream sm:text-6xl">Luxe</h2>
            <span className="mt-4 inline-block border border-luxe-champagne/50 px-3 py-1 font-sans text-[0.6rem] uppercase tracking-wider2 text-luxe-champagne">
              {LUXE_LIVE ? 'Now Live' : 'Coming Soon'}
            </span>
            <div>
              <Link href="/luxe" className="luxe-btn-ghost mt-7 !border-luxe-champagne/50 !text-luxe-cream">
                Explore Luxe
              </Link>
            </div>
          </Reveal>
        </div>

        {/* POPS — live */}
        <div className="relative flex min-h-[300px] items-center overflow-hidden bg-pops-violet px-8 py-16 sm:px-12">
          <div className="grain absolute inset-0 opacity-15 mix-blend-overlay" />
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-pops-lime/30 blur-3xl" />
          <Reveal className="relative z-10">
            <p className="font-display text-[0.7rem] font-bold uppercase tracking-widest text-pops-lime">
              Loud. Limited. Iconic.
            </p>
            <h2 className="mt-3 font-display text-5xl font-bold uppercase text-white drop-shadow-[3px_3px_0_#0E0E12] sm:text-6xl">
              Pops
            </h2>
            <span className="pops-chip mt-4 bg-pops-lime text-pops-black">
              {POPS_LIVE ? 'Now Live' : 'Coming Soon'}
            </span>
            <div>
              <Link
                href="/pops"
                className="mt-7 inline-flex items-center gap-2 rounded-full border-2 border-pops-black bg-pops-yellow px-7 py-3.5 font-display text-sm font-bold uppercase text-pops-black shadow-pops transition-transform hover:-translate-y-0.5"
              >
                Explore Pops ✦
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ————————————————————————————————————————————————
          FEATURES STRIP
         ———————————————————————————————————————————————— */}
      <section className="border-t border-luxe-charcoal/10 bg-luxe-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-10 sm:px-8 lg:grid-cols-4">
          {FEATURES.map(({ title, sub, Icon }) => (
            <div key={title} className="flex items-center gap-3.5">
              <Icon className="h-6 w-6 shrink-0 text-luxe-gold" />
              <div>
                <p className="font-sans text-[0.72rem] uppercase tracking-wider2 text-luxe-noir">
                  {title}
                </p>
                <p className="mt-0.5 font-sans text-xs text-luxe-stone">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/* ——— Inline icons ——— */
function FilterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function BoxIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 3 3 7.5v9L12 21l9-4.5v-9L12 3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M3 7.5 12 12l9-4.5M12 12v9" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 3l7 3v5c0 4.4-3 8-7 10-4-2-7-5.6-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ReturnIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 8h11a5 5 0 0 1 0 10H9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m7 5-3 3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
