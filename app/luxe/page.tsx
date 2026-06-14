import Link from 'next/link';
import { getProducts } from '@/lib/shopify';
import { PlaceholderFrame } from '@/components/shared/shop-image';
import { Reveal } from '@/components/shared/reveal';
import { LuxeProductCard } from '@/components/luxe/luxe-product-card';
import { formatPrice } from '@/lib/utils';

const HOUSE_CODES = [
  {
    label: 'Italian Mills',
    body: 'Double-faced wool, mulberry silk and tropical worsteds, woven by the same family mills that supply the great houses.',
  },
  {
    label: 'Hand-Finishing',
    body: 'Pick-stitched lapels, French seams and hand-rolled hems. The details you feel before you see.',
  },
  {
    label: 'Made to Last',
    body: 'Cut for the long line and built to be re-worn for a decade, not a season. Investment, not impulse.',
  },
  {
    label: 'Considered Sourcing',
    body: 'Grade-A cashmere, traceable nappa and certified mills. Luxury with a conscience, never a compromise.',
  },
];

export default async function LuxeHome() {
  const products = await getProducts({ universe: 'luxe' });
  const hero = products.find((p) => p.badge === 'Icon') ?? products[0];
  const rest = products;

  return (
    <>
      {/* ——————————————————————————————————————————————————————
          HERO — split: editorial copy + full-height imagery
         —————————————————————————————————————————————————————— */}
      <section className="relative grid min-h-[92vh] grid-cols-1 lg:grid-cols-2">
        {/* Copy */}
        <div className="relative z-10 flex items-center px-6 pb-20 pt-32 sm:px-10 lg:px-16 lg:py-0">
          <div className="max-w-xl">
            <Reveal>
              <p className="luxe-label text-luxe-gold">Spring — The Atelier Collection</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 font-serif text-5xl font-light leading-[1.05] text-luxe-noir text-balance sm:text-6xl lg:text-7xl">
                Quiet luxury, <span className="italic text-luxe-gold">considered</span> in every
                seam.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-7 max-w-md font-sans text-base leading-relaxed text-luxe-charcoal/80">
                Investment pieces in virgin wool, mulberry silk and grade-A cashmere — drawn by
                hand in Milan, cut to a single clean line, and made to outlive the season.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href="/luxe/collection" className="luxe-btn">
                  Explore the Collection
                </Link>
                <Link href="/luxe/world" className="luxe-btn-ghost">
                  The House of Qavier
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Imagery — full-height on desktop, banner on mobile */}
        <div className="relative order-first min-h-[46vh] lg:order-last lg:min-h-0">
          <PlaceholderFrame
            universe="luxe"
            className="absolute inset-0 h-full w-full"
            label="Spring Campaign — Imagery Forthcoming"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-luxe-cream/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-luxe-cream/60 lg:via-transparent" />
        </div>
      </section>

      {/* ——————————————————————————————————————————————————————
          TAGLINE STRIP
         —————————————————————————————————————————————————————— */}
      <section className="border-y border-luxe-charcoal/10 bg-luxe-ivory/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-7 text-center sm:px-10">
          {['Milanese Atelier', 'Hand-Finished', 'Italian Mills', 'Considered for Life'].map(
            (item) => (
              <span key={item} className="luxe-label text-luxe-stone">
                {item}
              </span>
            ),
          )}
        </div>
      </section>

      {/* ——————————————————————————————————————————————————————
          FEATURED / ICON
         —————————————————————————————————————————————————————— */}
      {hero && (
        <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal className="order-last lg:order-first">
              <p className="luxe-label text-luxe-gold">The Icon</p>
              <h2 className="mt-5 font-serif text-4xl font-light leading-tight text-luxe-noir sm:text-5xl">
                {hero.title}
              </h2>
              {hero.tagline && (
                <p className="mt-4 font-serif text-xl italic text-luxe-charcoal/70">
                  {hero.tagline}
                </p>
              )}
              <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-luxe-charcoal/80">
                {hero.description}
              </p>
              <div className="mt-8 flex items-center gap-8">
                <p className="font-serif text-2xl text-luxe-noir">
                  {formatPrice(hero.priceRange.minVariantPrice, { compact: true })}
                </p>
                <Link href={`/luxe/products/${hero.handle}`} className="luxe-btn">
                  Discover the Piece
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.1} y={40}>
              <Link
                href={`/luxe/products/${hero.handle}`}
                className="group block"
                aria-label={`View ${hero.title}`}
              >
                <PlaceholderFrame
                  universe="luxe"
                  className="aspect-[4/5] w-full shadow-luxe transition-transform duration-700 ease-luxe group-hover:scale-[1.01]"
                  label={hero.title}
                />
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ——————————————————————————————————————————————————————
          THE COLLECTION RAIL
         —————————————————————————————————————————————————————— */}
      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-10 lg:pb-32">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="luxe-label text-luxe-gold">Ready to Wear</p>
              <h2 className="mt-4 font-serif text-4xl font-light text-luxe-noir sm:text-5xl">
                The Collection
              </h2>
            </div>
            <Link
              href="/luxe/collection"
              className="luxe-label whitespace-nowrap text-luxe-charcoal transition-colors hover:text-luxe-gold"
            >
              View All →
            </Link>
          </div>
          <div className="luxe-rule mt-8" />
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {rest.map((product, i) => (
            <Reveal key={product.id} delay={(i % 4) * 0.06}>
              <LuxeProductCard product={product} priority={i < 4} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——————————————————————————————————————————————————————
          ATELIER
         —————————————————————————————————————————————————————— */}
      <section id="atelier" className="scroll-mt-24 bg-luxe-noir text-luxe-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 sm:px-10 lg:grid-cols-2 lg:gap-20 lg:py-32">
          <Reveal y={40}>
            <PlaceholderFrame
              universe="luxe"
              className="aspect-[4/5] w-full"
              label="Inside the Atelier"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="luxe-label text-luxe-champagne">Inside the Atelier</p>
            <h2 className="mt-5 font-serif text-4xl font-light leading-tight sm:text-5xl">
              Where restraint becomes the loudest statement.
            </h2>
            <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-luxe-cream/70">
              Every Qavier piece begins as a single line on paper and ends in the hands of a
              cutter who has spent a lifetime learning when to stop. We work the way the old
              houses did — slowly, deliberately, and never more than the garment asks for.
            </p>
            <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-luxe-cream/70">
              No logos shouting from the chest. No season-chasing. Only cloth, proportion and the
              patience to get both exactly right.
            </p>
            <Link href="/luxe/world" className="mt-8 inline-block luxe-label text-luxe-champagne hover:text-luxe-cream">
              Read the House Story →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ——————————————————————————————————————————————————————
          HOUSE CODES / MATERIALS
         —————————————————————————————————————————————————————— */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:py-32">
        <Reveal>
          <p className="luxe-label text-center text-luxe-gold">The House Codes</p>
          <h2 className="mx-auto mt-5 max-w-2xl text-center font-serif text-4xl font-light leading-tight text-luxe-noir sm:text-5xl">
            Four principles, woven through everything.
          </h2>
        </Reveal>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {HOUSE_CODES.map((code, i) => (
            <Reveal key={code.label} delay={(i % 4) * 0.06}>
              <div className="flex flex-col">
                <span className="font-serif text-5xl font-light text-luxe-champagne/40">
                  0{i + 1}
                </span>
                <p className="luxe-label mt-5 text-luxe-charcoal">{code.label}</p>
                <p className="mt-3 font-sans text-sm leading-relaxed text-luxe-stone">
                  {code.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——————————————————————————————————————————————————————
          LOOKBOOK — asymmetric grid of photo placeholders
         —————————————————————————————————————————————————————— */}
      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-10 lg:pb-32">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <p className="luxe-label text-luxe-gold">Spring / Summer</p>
              <h2 className="mt-4 font-serif text-4xl font-light text-luxe-noir sm:text-5xl">
                The Lookbook
              </h2>
            </div>
          </div>
          <div className="luxe-rule mt-8" />
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-7" y={40}>
            <PlaceholderFrame
              universe="luxe"
              className="aspect-[4/3] w-full"
              label="Lookbook 01"
            />
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.08} y={40}>
            <PlaceholderFrame
              universe="luxe"
              className="aspect-[3/4] w-full lg:h-full"
              label="Lookbook 02"
            />
          </Reveal>
          <Reveal className="col-span-2 lg:col-span-4" delay={0.04} y={40}>
            <PlaceholderFrame
              universe="luxe"
              className="aspect-[3/4] w-full"
              label="Lookbook 03"
            />
          </Reveal>
          <Reveal className="lg:col-span-4" delay={0.12} y={40}>
            <PlaceholderFrame
              universe="luxe"
              className="aspect-[3/4] w-full"
              label="Lookbook 04"
            />
          </Reveal>
          <Reveal className="lg:col-span-4" delay={0.16} y={40}>
            <PlaceholderFrame
              universe="luxe"
              className="aspect-[3/4] w-full"
              label="Lookbook 05"
            />
          </Reveal>
        </div>
      </section>

      {/* ——————————————————————————————————————————————————————
          CLOSING CTA BAND
         —————————————————————————————————————————————————————— */}
      <section className="relative overflow-hidden bg-luxe-noir">
        <PlaceholderFrame
          universe="luxe"
          className="absolute inset-0 h-full w-full opacity-20"
          label=""
        />
        <div className="relative mx-auto max-w-3xl px-6 py-28 text-center sm:px-10 lg:py-36">
          <Reveal>
            <p className="luxe-label text-luxe-champagne">Begin Your Wardrobe</p>
            <h2 className="mt-6 font-serif text-4xl font-light leading-tight text-luxe-cream sm:text-5xl lg:text-6xl">
              Dress for the life you intend to lead.
            </h2>
            <p className="mx-auto mt-6 max-w-lg font-sans text-base leading-relaxed text-luxe-cream/60">
              Eight pieces. One quiet philosophy. Discover the wardrobe built to be kept.
            </p>
            <div className="mt-10">
              <Link
                href="/luxe/collection"
                className="inline-flex items-center justify-center gap-2 border border-luxe-cream bg-luxe-cream px-8 py-4 font-sans text-[0.72rem] uppercase tracking-wider2 text-luxe-noir transition-all duration-500 ease-luxe hover:bg-transparent hover:text-luxe-cream"
              >
                Shop the Collection
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
