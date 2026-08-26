import Link from 'next/link';
import { getProducts } from '@/lib/shopify';
import { popsCategoryTiles } from '@/lib/pops-categories';
import { PlaceholderFrame, ShopImage } from '@/components/shared/shop-image';
import { PopsProductCard } from '@/components/pops/pops-product-card';
import { Reveal } from '@/components/shared/reveal';
import { Marquee } from '@/components/shared/marquee';

// Catalogue pages are regenerated at most this often, so Shopify price and
// stock edits reach the storefront without a redeploy. The /api/revalidate
// webhook flushes them immediately when Shopify pushes a change.
export const revalidate = 60;

const MARQUEE_WORDS = [
  'NEW DROP',
  '✦',
  'LIMITED',
  '★',
  'SHIP WORLDWIDE',
  '⚡',
  'GONE FAST',
  '✦',
  'WEAR IT LOUD',
  '★',
  'STUDENT DISCOUNT',
  '⚡',
];

// How the tiles are laid out, in the order popsCategoryTiles returns them.
const TILE_SHAPE = [
  { span: 'sm:col-span-2 sm:row-span-2', rotate: '-rotate-1' },
  { span: '', rotate: 'rotate-1' },
  { span: '', rotate: '-rotate-1' },
  { span: 'sm:col-span-2', rotate: 'rotate-1' },
];

export default async function PopsHome() {
  // Everything tagged `pops` in Shopify, newest first — this is the drop.
  const products = await getProducts({
    section: 'pops',
    sortKey: 'CREATED_AT',
    reverse: true,
  });
  const featured = products.slice(0, 8);
  const tiles = popsCategoryTiles(products).slice(0, 4);

  return (
    <div className="overflow-hidden">
      {/* ——————————————————————————— HERO ——————————————————————————— */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-gradient-to-br from-pops-magenta via-pops-purple to-pops-blue">
        {/* grain + blobs */}
        <div className="grain pointer-events-none absolute inset-0 opacity-20" />
        <div className="pointer-events-none absolute -left-16 top-24 h-72 w-72 animate-floaty rounded-full bg-pops-lime/70 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-10 h-80 w-80 animate-floaty rounded-full bg-pops-cyan/60 blur-3xl [animation-delay:1.5s]" />
        <div className="pointer-events-none absolute right-1/3 top-10 h-40 w-40 animate-floaty rounded-full bg-pops-yellow/50 blur-2xl [animation-delay:0.8s]" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:pt-28">
          <div>
            <span className="pops-chip -rotate-2 bg-pops-yellow text-pops-black shadow-pops">
              {products.length > 0
                ? `✦ ${products.length} ${products.length === 1 ? 'piece' : 'pieces'} live`
                : '✦ the drop lands soon'}
            </span>
            <h1 className="mt-5 font-display text-6xl font-bold uppercase leading-[0.9] text-white text-balance drop-shadow-[4px_4px_0_#0E0E12] sm:text-7xl lg:text-8xl">
              wear it
              <br />
              <span className="text-pops-lime">loud.</span>
            </h1>
            <p className="mt-6 max-w-md font-sans text-lg text-white/90">
              loud, limited & a little chaotic. the drop is here and it&apos;s gone before you
              finish scrolling. you&apos;ve been warned 🫠
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/pops/shop" className="pops-btn">
                shop the drop ⚡
              </Link>
              <Link
                href="/pops/drops"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-pops-black bg-pops-paper px-7 py-3.5 font-display text-base font-bold uppercase text-pops-black shadow-pops transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
              >
                see all drops
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="pops-chip bg-pops-cyan text-pops-black">free ship ₹100+</span>
              <span className="pops-chip bg-pops-lime text-pops-black">pay in 4</span>
              <span className="pops-chip bg-white text-pops-black">30-day returns</span>
            </div>
          </div>

          {/* Hero photo zone */}
          <div className="relative">
            <div className="relative aspect-[4/5] w-full rotate-2 overflow-hidden rounded-pops border-2 border-pops-black shadow-pops-lg">
              <PlaceholderFrame
                universe="pops"
                label="Campaign — Pics Soon"
                className="absolute inset-0 h-full w-full"
              />
              {/* Hero image — drop desktop_pops.png / mobile_pops.png into public/images. */}
              <div
                className="absolute inset-0 bg-cover bg-center md:hidden"
                style={{ backgroundImage: "url('/images/mobile_pops.png')" }}
              />
              <div
                className="absolute inset-0 hidden bg-cover bg-center md:block"
                style={{ backgroundImage: "url('/images/desktop_pops.png')" }}
              />
            </div>
            <span className="absolute -left-3 top-6 -rotate-6 rounded-full border-2 border-pops-black bg-pops-lime px-4 py-2 font-display text-sm font-bold uppercase text-pops-black shadow-pops sm:-left-6">
              brand new ✦
            </span>
            <span className="absolute -bottom-4 right-4 rotate-6 rounded-full border-2 border-pops-black bg-pops-magenta px-4 py-2 font-display text-sm font-bold uppercase text-white shadow-pops">
              gone fast ⚡
            </span>
          </div>
        </div>
      </section>

      {/* ——————————————————————————— MARQUEE ——————————————————————————— */}
      <div className="border-y-2 border-pops-black bg-pops-lime py-3.5">
        <Marquee>
          {MARQUEE_WORDS.map((w, i) => (
            <span
              key={i}
              className="mx-5 font-display text-xl font-bold uppercase tracking-tight text-pops-black sm:text-2xl"
            >
              {w}
            </span>
          ))}
        </Marquee>
      </div>

      {/* ——————————————————————————— THE DROP (live Shopify products) ——————————— */}
      {featured.length > 0 && (
        <section className="bg-pops-paper py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-12">
              <div>
                <span className="pops-chip bg-pops-lime text-pops-black">⚡ in the drop</span>
                <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none text-pops-black sm:text-6xl">
                  shop the drop
                </h2>
              </div>
              <Link href="/pops/shop" className="pops-btn">
                shop everything ⚡
              </Link>
            </Reveal>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {featured.map((p, i) => (
                <PopsProductCard key={p.id} product={p} index={i} priority={i < 4} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ——————————————————————————— BENTO CATEGORIES ——————————————————————————— */}
      {/* Built from the categories that actually have stock in Shopify — a
          category with nothing in it simply doesn't appear. */}
      {tiles.length > 0 && (
        <section className="bg-pops-cream py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal className="mb-8 sm:mb-12">
              <span className="pops-chip bg-pops-magenta text-white">⚡ pick your poison</span>
              <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none text-pops-black sm:text-6xl">
                shop by vibe
              </h2>
            </Reveal>

            <Reveal className="grid auto-rows-[150px] grid-cols-2 gap-4 sm:auto-rows-[180px] sm:grid-cols-4 sm:gap-6">
              {tiles.map(({ cat, products: inCat }, i) => {
                const shape = TILE_SHAPE[i] ?? TILE_SHAPE[0];
                return (
                  <Link
                    key={cat.slug}
                    href={`/pops/shop?c=${cat.slug}`}
                    className={`group relative flex flex-col justify-between overflow-hidden rounded-pops border-2 border-pops-black p-4 shadow-pops transition-transform duration-200 hover:-translate-y-1.5 hover:shadow-pops-lg sm:p-5 ${cat.bg} ${shape.span}`}
                  >
                    {/* Real product imagery from the category itself. */}
                    <ShopImage
                      image={inCat[0].featuredImage}
                      universe="pops"
                      sizes="(max-width: 640px) 50vw, 25vw"
                      label={cat.label}
                      className={`absolute inset-0 h-full w-full opacity-40 transition-transform duration-300 group-hover:scale-105 ${shape.rotate}`}
                    />
                    <span className="relative z-10 self-start rounded-full border-2 border-pops-black bg-pops-paper px-3 py-1 font-display text-[0.65rem] font-bold uppercase text-pops-black">
                      {inCat.length} {inCat.length === 1 ? 'piece' : 'pieces'}
                    </span>
                    <div className="relative z-10">
                      <h3 className="font-display text-3xl font-bold uppercase leading-none text-pops-black sm:text-4xl">
                        {cat.label}
                      </h3>
                      <p className="mt-1 font-sans text-xs font-semibold text-pops-black/70">
                        {cat.blurb} ⟶
                      </p>
                    </div>
                  </Link>
                );
              })}
            </Reveal>
          </div>
        </section>
      )}

      {/* ——————————————————————————— DROPS TEASER ——————————————————————————— */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-pops border-2 border-pops-black bg-pops-black p-8 text-pops-cream shadow-pops-lg sm:p-14">
            <div className="grain pointer-events-none absolute inset-0 opacity-20" />
            <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 animate-spinslow rounded-full bg-pops-violet/40 blur-3xl" />
            <div className="relative z-10 grid items-center gap-8 lg:grid-cols-2">
              <div>
                <span className="pops-chip bg-pops-lime text-pops-black">★ every friday 6pm</span>
                <h2 className="mt-4 font-display text-5xl font-bold uppercase leading-none text-pops-lime sm:text-6xl">
                  new drops
                  <br />
                  weekly.
                </h2>
                <p className="mt-4 max-w-md font-sans text-pops-cream/70">
                  limited runs. no restocks. once it&apos;s gone, it&apos;s gone for real. set a
                  reminder or cry later — your call.
                </p>
                <Link href="/pops/drops" className="pops-btn mt-7">
                  enter the drop zone ⚡
                </Link>
              </div>
              {/* Three pieces from the live drop, straight from Shopify. */}
              <div className="grid grid-cols-3 gap-3">
                {featured.slice(0, 3).map((p, i) => (
                      <Link
                        key={p.id}
                        href={`/pops/products/${p.handle}`}
                        className={`group relative block aspect-square overflow-hidden rounded-pops border-2 border-pops-cream/30 ${
                          i === 1 ? 'translate-y-4' : ''
                        }`}
                      >
                        <ShopImage
                          image={p.featuredImage}
                          universe="pops"
                          sizes="(max-width: 640px) 30vw, 15vw"
                          label={p.title}
                          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-pops-black/70 px-2 py-1 text-center font-display text-[0.6rem] font-bold uppercase text-pops-cream">
                          {p.availableForSale ? 'live ⚡' : 'sold out'}
                        </span>
                      </Link>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——————————————————————————— THE FEED ——————————————————————————— */}
      <section id="feed" className="scroll-mt-28 bg-pops-violet py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="mb-8 text-center sm:mb-12">
            <span className="pops-chip bg-pops-yellow text-pops-black">📸 the feed</span>
            <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none text-white sm:text-6xl">
              tag us @qavierpops
            </h2>
            <p className="mt-3 font-sans text-white/80">
              fit pics, hauls, chaos. repost worthy = reposted. show us how you wear it loud.
            </p>
          </Reveal>

          <Reveal className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <PlaceholderFrame
                key={i}
                universe="pops"
                label={i % 2 === 0 ? '@qavierpops' : 'tag us ✦'}
                className={`aspect-square rounded-pops border-2 border-pops-black shadow-pops ${
                  i % 3 === 0 ? '-rotate-1' : 'rotate-1'
                }`}
              />
            ))}
          </Reveal>
        </div>
      </section>

      {/* ——————————————————————————— CLOSING CTA ——————————————————————————— */}
      <section className="bg-pops-lime py-20 sm:py-28">
        <Reveal className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <span className="pops-chip bg-pops-black text-pops-lime">don&apos;t sleep on it</span>
          <h2 className="mt-4 font-display text-6xl font-bold uppercase leading-[0.9] text-pops-black text-balance sm:text-7xl lg:text-8xl">
            the drop won&apos;t wait.
          </h2>
          <p className="mx-auto mt-5 max-w-md font-sans text-lg text-pops-black/70">
            you saw it, you want it, it&apos;s limited. you know what to do.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/pops/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-pops-black bg-pops-magenta px-8 py-4 font-display text-lg font-bold uppercase text-white shadow-pops transition-transform hover:-translate-y-0.5 hover:shadow-pops-lg active:translate-y-1 active:shadow-none"
            >
              shop everything ⚡
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-pops-black bg-pops-paper px-8 py-4 font-display text-base font-bold uppercase text-pops-black transition-transform hover:-translate-y-0.5"
            >
              back to qavier ⟶
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
