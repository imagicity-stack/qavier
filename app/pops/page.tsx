import Link from 'next/link';
import { getProducts } from '@/lib/shopify';
import { PopsProductCard } from '@/components/pops/pops-product-card';
import { PlaceholderFrame } from '@/components/shared/shop-image';
import { Reveal } from '@/components/shared/reveal';
import { Marquee } from '@/components/shared/marquee';

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

const BENTO = [
  {
    label: 'tops',
    sub: 'tees + hoodies',
    bg: 'bg-pops-lime',
    span: 'sm:col-span-2 sm:row-span-2',
    rotate: '-rotate-1',
  },
  { label: 'bottoms', sub: 'cargos + skirts', bg: 'bg-pops-cyan', span: '', rotate: 'rotate-1' },
  { label: 'outerwear', sub: 'puffers + bombers', bg: 'bg-pops-pink', span: '', rotate: '-rotate-1' },
  {
    label: 'footwear',
    sub: 'stompers',
    bg: 'bg-pops-yellow',
    span: 'sm:col-span-2',
    rotate: 'rotate-1',
  },
];

export default async function PopsHome() {
  const products = await getProducts({ universe: 'pops' });
  const bestsellers = products.slice(0, 8);

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
              ✦ drop 01 is live
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
            <PlaceholderFrame
              universe="pops"
              label="Campaign Drop 01 — Pics Soon"
              className="aspect-[4/5] w-full rotate-2 rounded-pops border-2 border-pops-black shadow-pops-lg"
            />
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

      {/* ——————————————————————————— BESTSELLERS ——————————————————————————— */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-12">
          <div>
            <span className="pops-chip bg-pops-violet text-white">★ flying off the shelves</span>
            <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none text-pops-black sm:text-6xl">
              cop the
              <br />
              bestsellers
            </h2>
          </div>
          <Link
            href="/pops/shop"
            className="hidden rounded-full border-2 border-pops-black bg-pops-paper px-6 py-3 font-display text-sm font-bold uppercase text-pops-black shadow-pops transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            shop all ⟶
          </Link>
        </Reveal>

        <Reveal className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {bestsellers.map((p, i) => (
            <PopsProductCard key={p.id} product={p} index={i} priority={i < 4} />
          ))}
        </Reveal>

        <div className="mt-8 sm:hidden">
          <Link href="/pops/shop" className="pops-btn w-full">
            shop all ⟶
          </Link>
        </div>
      </section>

      {/* ——————————————————————————— BENTO CATEGORIES ——————————————————————————— */}
      <section className="bg-pops-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="mb-8 sm:mb-12">
            <span className="pops-chip bg-pops-magenta text-white">⚡ pick your poison</span>
            <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none text-pops-black sm:text-6xl">
              shop by vibe
            </h2>
          </Reveal>

          <Reveal className="grid auto-rows-[150px] grid-cols-2 gap-4 sm:auto-rows-[180px] sm:grid-cols-4 sm:gap-6">
            {BENTO.map((tile, i) => (
              <Link
                key={tile.label}
                href="/pops/shop"
                className={`group relative flex flex-col justify-between overflow-hidden rounded-pops border-2 border-pops-black p-4 shadow-pops transition-transform duration-200 hover:-translate-y-1.5 hover:shadow-pops-lg sm:p-5 ${tile.bg} ${tile.span}`}
              >
                <PlaceholderFrame
                  universe="pops"
                  label={tile.label}
                  className={`absolute inset-0 opacity-40 transition-transform duration-300 group-hover:scale-105 ${tile.rotate}`}
                />
                <span className="relative z-10 self-start rounded-full border-2 border-pops-black bg-pops-paper px-3 py-1 font-display text-[0.65rem] font-bold uppercase text-pops-black">
                  0{i + 1}
                </span>
                <div className="relative z-10">
                  <h3 className="font-display text-3xl font-bold uppercase leading-none text-pops-black sm:text-4xl">
                    {tile.label}
                  </h3>
                  <p className="mt-1 font-sans text-xs font-semibold text-pops-black/70">
                    {tile.sub} ⟶
                  </p>
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

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
              <div className="grid grid-cols-3 gap-3">
                {['live', 'soon', 'sold out'].map((status, i) => (
                  <PlaceholderFrame
                    key={status}
                    universe="pops"
                    label={`drop 0${i + 1} · ${status}`}
                    className={`aspect-square rounded-pops border-2 border-pops-cream/30 ${
                      i === 1 ? 'translate-y-4' : ''
                    }`}
                  />
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
              cross over to luxe ⟶
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
