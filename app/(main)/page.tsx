import Link from 'next/link';
import { getProducts } from '@/lib/shopify';
import { PlaceholderFrame } from '@/components/shared/shop-image';
import { Reveal } from '@/components/shared/reveal';
import { LuxeProductCard } from '@/components/luxe/luxe-product-card';

const FEATURES = ['Premium Fabrics', 'Thoughtful Design', 'Lasting Quality'];

const COLLECTIONS = [
  { label: 'Tailoring', count: '18 Pieces' },
  { label: 'Eveningwear', count: '12 Pieces' },
  { label: 'Knitwear', count: '24 Pieces' },
  { label: 'Outerwear', count: '16 Pieces' },
];

const VALUES = [
  { title: 'Premium Quality', body: 'The finest fabrics and craftsmanship.' },
  { title: 'Timeless Design', body: 'Styles that transcend the season.' },
  { title: 'Made for You', body: 'Considered, from first cut to final stitch.' },
];

export default async function QavierHome() {
  const products = await getProducts({ universe: 'luxe' });
  const newIn = products.slice(0, 4);

  return (
    <>
      {/* ——————————————————————————————————————————————————————
          HERO — image-led, minimal copy
         —————————————————————————————————————————————————————— */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-luxe-noir">
        {/* Fallback frame — shows until the hero photo is added. */}
        <PlaceholderFrame
          universe="luxe"
          className="absolute inset-0 h-full w-full"
          label="Hero Campaign — Imagery Forthcoming"
        />
        {/* Hero photo. Drop your image at `public/images/homescreen.png`.
            Until that file exists this layer is transparent (no broken-image
            icon) and the placeholder frame above simply shows through. */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/homescreen.png')" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-luxe-noir/35 via-transparent to-luxe-noir/5" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 sm:px-10 lg:pb-24">
          <Reveal>
            <p className="luxe-label text-luxe-noir/70">Qavier</p>
            <h1 className="mt-5 max-w-2xl font-serif text-5xl font-light leading-[1.02] text-luxe-noir text-balance sm:text-6xl lg:text-7xl">
              Timeless fashion.
              <br />
              Modern elegance.
            </h1>
            <p className="mt-5 max-w-sm font-sans text-base text-luxe-charcoal/80">
              Effortless style for the modern woman.
            </p>
            <Link href="/shop" className="luxe-btn mt-9">
              Shop Now
            </Link>
          </Reveal>
        </div>

        {/* Feature strip */}
        <div className="relative z-10 border-t border-luxe-noir/10 bg-luxe-cream/70 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-6 py-4 sm:px-10">
            {FEATURES.map((f, i) => (
              <span key={f} className="flex items-center gap-10">
                {i > 0 && <span className="hidden h-1 w-1 rounded-full bg-luxe-stone sm:block" />}
                <span className="luxe-label text-luxe-stone">{f}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ——————————————————————————————————————————————————————
          NEW IN — a clean four-up rail
         —————————————————————————————————————————————————————— */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:py-28">
        <Reveal className="mb-10 flex items-end justify-between">
          <h2 className="font-serif text-3xl font-light text-luxe-noir sm:text-4xl">New In</h2>
          <Link
            href="/shop"
            className="luxe-label text-luxe-charcoal transition-colors hover:text-luxe-gold"
          >
            View All →
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {newIn.map((product, i) => (
            <Reveal key={product.id} delay={(i % 4) * 0.06}>
              <LuxeProductCard product={product} priority={i < 4} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——————————————————————————————————————————————————————
          COLLECTIONS — image cards, almost no words
         —————————————————————————————————————————————————————— */}
      <section className="bg-luxe-ivory/50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal className="mb-10 text-center">
            <p className="luxe-label text-luxe-stone">Shop by Category</p>
            <h2 className="mt-3 font-serif text-4xl font-light text-luxe-noir sm:text-5xl">
              Collections
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {COLLECTIONS.map((c, i) => (
              <Reveal key={c.label} delay={(i % 4) * 0.06}>
                <Link href={`/shop?category=${c.label.toLowerCase()}`} className="group block">
                  <PlaceholderFrame
                    universe="luxe"
                    className="aspect-[3/4] w-full overflow-hidden transition-transform duration-700 ease-luxe group-hover:scale-[1.02]"
                    label={c.label}
                  />
                  <div className="mt-4 flex items-baseline justify-between">
                    <h3 className="font-serif text-xl text-luxe-noir transition-colors group-hover:text-luxe-gold">
                      {c.label}
                    </h3>
                    <span className="luxe-label text-luxe-stone">{c.count}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——————————————————————————————————————————————————————
          EDITORIAL — one image, one line  (footer anchor: #atelier)
         —————————————————————————————————————————————————————— */}
      <section id="atelier" className="scroll-mt-24">
        <div className="relative flex min-h-[70vh] items-center overflow-hidden">
          <PlaceholderFrame
            universe="luxe"
            className="absolute inset-0 h-full w-full"
            label="The Atelier"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-luxe-cream/80 via-luxe-cream/30 to-transparent" />
          <Reveal className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10">
            <div className="max-w-md">
              <p className="luxe-label text-luxe-gold">The House of Qavier</p>
              <h2 className="mt-5 font-serif text-4xl font-light leading-tight text-luxe-noir sm:text-5xl">
                Designed for every moment, crafted to last.
              </h2>
              <Link href="/about" className="luxe-btn-ghost mt-8">
                Our Story
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——————————————————————————————————————————————————————
          VALUES — three lines, no more
         —————————————————————————————————————————————————————— */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:py-28">
        <div className="grid gap-12 border-y border-luxe-charcoal/10 py-14 sm:grid-cols-3 sm:gap-8">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08} className="text-center">
              <p className="luxe-label text-luxe-gold">0{i + 1}</p>
              <h3 className="mt-4 font-serif text-2xl text-luxe-noir">{v.title}</h3>
              <p className="mt-2 font-sans text-sm text-luxe-stone">{v.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——————————————————————————————————————————————————————
          CLOSING
         —————————————————————————————————————————————————————— */}
      <section className="relative overflow-hidden bg-luxe-noir">
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center sm:px-10 lg:py-32">
          <Reveal>
            <h2 className="font-serif text-4xl font-light leading-tight text-luxe-cream sm:text-5xl">
              Dress for the life you intend to lead.
            </h2>
            <Link
              href="/shop"
              className="mt-9 inline-flex items-center justify-center gap-2 border border-luxe-cream bg-luxe-cream px-9 py-4 font-sans text-[0.72rem] uppercase tracking-wider2 text-luxe-noir transition-all duration-500 ease-luxe hover:bg-transparent hover:text-luxe-cream"
            >
              Shop the Collection
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
