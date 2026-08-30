import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/shopify';
import { PlaceholderFrame, ShopImage } from '@/components/shared/shop-image';
import { PopsProductCard } from '@/components/pops/pops-product-card';
import { Reveal } from '@/components/shared/reveal';
import { Marquee } from '@/components/shared/marquee';
import { PopsCountdown } from '@/components/pops/pops-countdown';

// Catalogue pages are regenerated at most this often, so Shopify price and
// stock edits reach the storefront without a redeploy. The /api/revalidate
// webhook flushes them immediately when Shopify pushes a change.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Drops',
  description:
    'New drops every Friday 6pm. Limited runs, no restocks, gone before you finish scrolling. The Qavier Pops drop, live.',
};

const FAQ = [
  {
    q: 'how do the drops actually work?',
    a: 'new collection goes live every friday at 6pm (your local time). limited quantities, first come first served. once a size or colour sells out, that’s it — no restocks, no waitlist, no take-backs.',
  },
  {
    q: 'will sold-out stuff come back?',
    a: 'almost never. drops are one-and-done by design. occasionally a cult favourite returns in a brand-new colourway, but assume gone = gone forever and you’ll never be sad.',
  },
  {
    q: 'how fast is shipping?',
    a: 'we ship worldwide. orders go out in 1–2 business days. free shipping over ₹100, flat rate under that. you’ll get tracking the second it leaves us.',
  },
  {
    q: 'what about returns?',
    a: '30-day easy returns on unworn pieces with tags on. sale items are final sale. start a return from your confirmation email — it takes about two minutes.',
  },
  {
    q: 'how do i nail the sizing?',
    a: 'most pops pieces run oversized on purpose. want it boxy? grab your usual. want it fitted? size down. full measurements live on every product page so you can check before you cop.',
  },
];

export default async function PopsDrops() {
  // The drop is whatever is tagged `pops` in Shopify, newest first.
  const products = await getProducts({
    section: 'pops',
    sortKey: 'CREATED_AT',
    reverse: true,
  });
  const hero = products[0];
  const inStock = products.filter((p) => p.availableForSale).length;

  return (
    <div className="overflow-hidden">
      {/* ——————————————————————————— HEADER ——————————————————————————— */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-8 sm:pt-28">
        <Reveal>
          <span className="pops-chip -rotate-1 bg-pops-magenta text-white shadow-pops">
            ⚡ drop culture
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] text-pops-black text-balance sm:text-6xl md:text-7xl lg:text-8xl">
            the drops
          </h1>
          <p className="mt-4 max-w-xl font-sans text-base text-pops-black/70 sm:text-lg">
            new heat every friday 6pm. limited runs, zero restocks, blink and it&apos;s gone. this
            is how we do it 🫠
          </p>
        </Reveal>
      </section>

      {/* ——————————————————————————— CURRENT DROP ——————————————————————————— */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12 lg:py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-pops border-2 border-pops-black bg-gradient-to-br from-pops-magenta via-pops-purple to-pops-blue p-5 text-white shadow-pops-lg sm:p-8 lg:p-10">
            <div className="grain pointer-events-none absolute inset-0 opacity-20" />
            <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 animate-floaty rounded-full bg-pops-lime/50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 left-1/3 h-48 w-48 animate-floaty rounded-full bg-pops-cyan/50 blur-3xl [animation-delay:1.2s]" />

            <div className="relative z-10 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Drop photo zone — the newest piece in the drop. */}
              <div className="relative order-2 lg:order-1">
                {hero ? (
                  <Link
                    href={`/pops/products/${hero.handle}`}
                    className="group block aspect-[4/5] w-full overflow-hidden rounded-pops border-2 border-pops-black shadow-pops sm:-rotate-2"
                  >
                    <ShopImage
                      image={hero.featuredImage}
                      universe="pops"
                      priority
                      sizes="(max-width: 1024px) 90vw, 45vw"
                      label={hero.title}
                      className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                ) : (
                  <PlaceholderFrame
                    universe="pops"
                    label="This Week's Drop"
                    className="aspect-[4/5] w-full rounded-pops border-2 border-pops-black shadow-pops sm:-rotate-2"
                  />
                )}
                {products.length > 0 && (
                  <span className="absolute -right-3 top-6 rotate-6 rounded-full border-2 border-pops-black bg-pops-lime px-3 py-1.5 font-display text-xs font-bold uppercase text-pops-black shadow-pops sm:px-4 sm:py-2 sm:text-sm">
                    live now ⚡
                  </span>
                )}
              </div>

              {/* Drop info + countdown */}
              <div className="order-1 lg:order-2">
                <span className="pops-chip bg-pops-yellow text-pops-black">
                  {products.length > 0
                    ? `★ ${products.length} ${products.length === 1 ? 'piece' : 'pieces'} · ${inStock} in stock`
                    : '★ the next drop is loading'}
                </span>
                <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-[0.95] text-pops-lime sm:text-5xl lg:text-6xl">
                  {products.length > 0 ? (
                    <>
                      this week&apos;s
                      <br />
                      drop is live.
                    </>
                  ) : (
                    <>
                      the next
                      <br />
                      drop lands soon.
                    </>
                  )}
                </h2>
                <p className="mt-4 max-w-md font-sans text-white/85">
                  {products.length > 0
                    ? 'limited runs, no restocks. once a size sells out it is gone for good. next drop lands:'
                    : 'nothing live right this second. the next one lands:'}
                </p>

                <div className="mt-6">
                  <p className="mb-3 font-display text-sm font-bold uppercase text-white/80">
                    drops friday 6pm · in
                  </p>
                  <PopsCountdown />
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/pops/shop" className="pops-btn">
                    shop the drop ⚡
                  </Link>
                  <a
                    href="#faq"
                    className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-pops-black bg-pops-paper px-5 py-3 font-display text-sm font-bold uppercase text-pops-black sm:px-7 sm:py-3.5 sm:text-base shadow-pops transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
                  >
                    how it works
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——————————————————————————— MARQUEE ——————————————————————————— */}
      <div className="border-y-2 border-pops-black bg-pops-lime py-3.5">
        <Marquee fast>
          {['FRIDAY 6PM', '✦', 'LIMITED RUN', '★', 'NO RESTOCKS', '⚡', 'SHIP WORLDWIDE', '★'].map(
            (w, i) => (
              <span
                key={i}
                className="mx-3 font-display text-sm font-bold uppercase tracking-tight text-pops-black sm:mx-5 sm:text-xl lg:text-2xl"
              >
                {w}
              </span>
            ),
          )}
        </Marquee>
      </div>

      {/* ——————————————————————————— IN THE DROP ——————————————————————————— */}
      {/* The live drop, straight from Shopify — every product tagged `pops`,
          newest first. Nothing here is authored in code. */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal className="mb-8 sm:mb-12">
          <span className="pops-chip bg-pops-violet text-white">✦ the lineup</span>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-none text-pops-black sm:text-5xl lg:text-6xl">
            in this drop
          </h2>
          <p className="mt-3 max-w-lg font-sans text-pops-black/70">
            everything live right now, newest first. catch &apos;em while they last — sold out
            means sold out.
          </p>
        </Reveal>

        {products.length > 0 ? (
          <Reveal className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 12).map((p, i) => (
              <PopsProductCard key={p.id} product={p} index={i} priority={i < 4} />
            ))}
          </Reveal>
        ) : (
          <Reveal className="rounded-pops border-2 border-dashed border-pops-black/40 bg-pops-cream p-12 text-center">
            <p className="font-display text-3xl font-bold uppercase text-pops-black">
              nothing live rn 🫠
            </p>
            <p className="mt-2 font-sans text-pops-black/60">
              the next drop is still in the studio. check back friday 6pm.
            </p>
          </Reveal>
        )}
      </section>

      {/* ——————————————————————————— FAQ ——————————————————————————— */}
      <section id="faq" className="scroll-mt-28 bg-pops-cream py-10 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-8">
          <Reveal className="mb-8 text-center sm:mb-12">
            <span className="pops-chip bg-pops-black text-pops-lime">🤔 the fine print</span>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-none text-pops-black sm:text-5xl lg:text-6xl">
              drop faq
            </h2>
            <p className="mt-3 font-sans text-pops-black/70">
              everything you need to know before friday hits.
            </p>
          </Reveal>

          <Reveal className="flex flex-col gap-4">
            {FAQ.map((item, i) => (
              <details
                key={i}
                className="group rounded-pops border-2 border-pops-black bg-pops-paper shadow-pops transition-transform open:-translate-y-0.5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display text-lg font-bold uppercase text-pops-black [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <span
                    aria-hidden
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-pops-black bg-pops-lime font-display text-xl font-bold leading-none text-pops-black transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="border-t-2 border-pops-black p-5 font-sans text-pops-black/80">
                  {item.a}
                </p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ——————————————————————————— CLOSING CTA ——————————————————————————— */}
      <section className="bg-pops-magenta py-12 text-center sm:py-20 lg:py-28">
        <Reveal className="mx-auto max-w-2xl px-4 sm:px-8">
          <span className="pops-chip bg-white text-pops-black">don&apos;t miss the next one</span>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-[0.95] text-white text-balance sm:text-5xl lg:text-7xl">
            set a reminder.
            <br />
            <span className="text-pops-lime">cry later.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md font-sans text-base text-white/85 sm:mt-5 sm:text-lg">
            the current drop is live right now. you already know how this ends.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/pops/shop" className="pops-btn">
              shop this drop ⚡
            </Link>
            <Link
              href="/pops"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-pops-black bg-pops-paper px-5 py-3 font-display text-sm font-bold uppercase text-pops-black sm:px-7 sm:py-3.5 sm:text-base transition-transform hover:-translate-y-0.5"
            >
              back home ⟵
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
