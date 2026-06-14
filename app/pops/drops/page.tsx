import type { Metadata } from 'next';
import Link from 'next/link';
import { PlaceholderFrame } from '@/components/shared/shop-image';
import { Reveal } from '@/components/shared/reveal';
import { Marquee } from '@/components/shared/marquee';
import { PopsCountdown } from '@/components/pops/pops-countdown';

export const metadata: Metadata = {
  title: 'Drops',
  description:
    'New drops every Friday 6pm. Limited runs, no restocks, gone before you finish scrolling. The Qavier Pops drop schedule, live.',
};

type Status = 'live' | 'soon' | 'sold out';

const SCHEDULE: { n: string; name: string; status: Status; bg: string }[] = [
  { n: '06', name: 'acid summer', status: 'soon', bg: 'bg-pops-lime' },
  { n: '05', name: 'oil slick', status: 'live', bg: 'bg-pops-cyan' },
  { n: '04', name: 'cyber bloom', status: 'sold out', bg: 'bg-pops-pink' },
  { n: '03', name: 'static noise', status: 'sold out', bg: 'bg-pops-violet' },
  { n: '02', name: 'bubblegum riot', status: 'sold out', bg: 'bg-pops-yellow' },
  { n: '01', name: 'genesis', status: 'sold out', bg: 'bg-pops-orange' },
];

const STATUS_STYLE: Record<Status, string> = {
  live: 'bg-pops-lime text-pops-black',
  soon: 'bg-pops-paper text-pops-black',
  'sold out': 'bg-pops-black text-pops-cream',
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
    a: 'we ship worldwide. orders go out in 1–2 business days. free shipping over $100, flat rate under that. you’ll get tracking the second it leaves us.',
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

export default function PopsDrops() {
  return (
    <div className="overflow-hidden">
      {/* ——————————————————————————— HEADER ——————————————————————————— */}
      <section className="mx-auto max-w-7xl px-5 pt-28 sm:px-8">
        <Reveal>
          <span className="pops-chip -rotate-1 bg-pops-magenta text-white shadow-pops">
            ⚡ drop culture
          </span>
          <h1 className="mt-4 font-display text-6xl font-bold uppercase leading-[0.88] text-pops-black text-balance sm:text-7xl lg:text-8xl">
            the drops
          </h1>
          <p className="mt-4 max-w-xl font-sans text-lg text-pops-black/70">
            new heat every friday 6pm. limited runs, zero restocks, blink and it&apos;s gone. this
            is how we do it 🫠
          </p>
        </Reveal>
      </section>

      {/* ——————————————————————————— CURRENT DROP ——————————————————————————— */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-pops border-2 border-pops-black bg-gradient-to-br from-pops-magenta via-pops-purple to-pops-blue p-6 text-white shadow-pops-lg sm:p-10">
            <div className="grain pointer-events-none absolute inset-0 opacity-20" />
            <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 animate-floaty rounded-full bg-pops-lime/50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 left-1/3 h-48 w-48 animate-floaty rounded-full bg-pops-cyan/50 blur-3xl [animation-delay:1.2s]" />

            <div className="relative z-10 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Drop photo zone */}
              <div className="relative order-2 lg:order-1">
                <PlaceholderFrame
                  universe="pops"
                  label="This Week's Drop"
                  className="aspect-[4/5] w-full -rotate-2 rounded-pops border-2 border-pops-black shadow-pops"
                />
                <span className="absolute -right-3 top-6 rotate-6 rounded-full border-2 border-pops-black bg-pops-lime px-4 py-2 font-display text-sm font-bold uppercase text-pops-black shadow-pops">
                  live now ⚡
                </span>
              </div>

              {/* Drop info + countdown */}
              <div className="order-1 lg:order-2">
                <span className="pops-chip bg-pops-yellow text-pops-black">★ drop 05 · oil slick</span>
                <h2 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.9] text-pops-lime sm:text-6xl">
                  this week&apos;s
                  <br />
                  drop is live.
                </h2>
                <p className="mt-4 max-w-md font-sans text-white/85">
                  iridescent everything. oil-slick shells, reflective trims, and the most chaotic
                  colourways we&apos;ve made yet. next drop lands:
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
                    className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-pops-black bg-pops-paper px-7 py-3.5 font-display text-base font-bold uppercase text-pops-black shadow-pops transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
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
                className="mx-5 font-display text-xl font-bold uppercase tracking-tight text-pops-black sm:text-2xl"
              >
                {w}
              </span>
            ),
          )}
        </Marquee>
      </div>

      {/* ——————————————————————————— DROP SCHEDULE ——————————————————————————— */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal className="mb-8 sm:mb-12">
          <span className="pops-chip bg-pops-violet text-white">✦ the lineup</span>
          <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none text-pops-black sm:text-6xl">
            drop schedule
          </h2>
          <p className="mt-3 max-w-lg font-sans text-pops-black/70">
            past, present & coming up. catch &apos;em while they&apos;re live or admire the
            sold-out hall of fame.
          </p>
        </Reveal>

        <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {SCHEDULE.map((drop) => (
            <div
              key={drop.n}
              className={`group relative flex flex-col overflow-hidden rounded-pops border-2 border-pops-black ${drop.bg} shadow-pops transition-transform duration-200 hover:-translate-y-1.5 hover:shadow-pops-lg`}
            >
              <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-pops-black">
                <PlaceholderFrame
                  universe="pops"
                  label={`Drop ${drop.n} — ${drop.name}`}
                  className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                />
                <span
                  className={`absolute right-3 top-3 rotate-2 rounded-full border-2 border-pops-black px-3 py-1 font-display text-[0.7rem] font-bold uppercase shadow-pops ${STATUS_STYLE[drop.status]}`}
                >
                  {drop.status}
                </span>
              </div>
              <div className="flex items-end justify-between gap-2 p-4">
                <div>
                  <span className="font-display text-[0.7rem] font-bold uppercase text-pops-black/60">
                    drop {drop.n}
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase leading-none text-pops-black">
                    {drop.name}
                  </h3>
                </div>
                {drop.status === 'live' ? (
                  <Link
                    href="/pops/shop"
                    className="shrink-0 rounded-full border-2 border-pops-black bg-pops-black px-4 py-2 font-display text-xs font-bold uppercase text-pops-lime"
                  >
                    shop ⟶
                  </Link>
                ) : (
                  <span className="shrink-0 font-display text-2xl font-bold text-pops-black/50" aria-hidden>
                    {drop.status === 'soon' ? '👀' : '🫠'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ——————————————————————————— FAQ ——————————————————————————— */}
      <section id="faq" className="scroll-mt-28 bg-pops-cream py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal className="mb-8 text-center sm:mb-12">
            <span className="pops-chip bg-pops-black text-pops-lime">🤔 the fine print</span>
            <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none text-pops-black sm:text-6xl">
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
      <section className="bg-pops-magenta py-20 text-center sm:py-28">
        <Reveal className="mx-auto max-w-2xl px-5 sm:px-8">
          <span className="pops-chip bg-white text-pops-black">don&apos;t miss the next one</span>
          <h2 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.9] text-white text-balance sm:text-6xl lg:text-7xl">
            set a reminder.
            <br />
            <span className="text-pops-lime">cry later.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md font-sans text-lg text-white/85">
            the current drop is live right now. you already know how this ends.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/pops/shop" className="pops-btn">
              shop this drop ⚡
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
