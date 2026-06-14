import type { Metadata } from 'next';
import Link from 'next/link';
import { PlaceholderFrame } from '@/components/shared/shop-image';
import { Reveal } from '@/components/shared/reveal';

export const metadata: Metadata = {
  title: 'The House',
  description:
    'The House of Qavier — a quiet-luxury maison drawn by hand in Milan. Our story, our codes, and the care behind every seam.',
};

const STORY = [
  {
    kicker: 'The Founder',
    title: 'It began with a refusal.',
    body: [
      'Qavier was founded on a single objection: that luxury had grown loud. Logos shouting across the chest, collections chasing the calendar, garments built to be replaced. We wanted the opposite — clothing that announces nothing and outlasts everything.',
      'So we returned to the old discipline. One line on paper. One cutter. One finisher. And the patience to stop only when the garment asks us to.',
    ],
    label: 'The Founder — Portrait',
    flip: false,
  },
  {
    kicker: 'The First Collection',
    title: 'Eight pieces, and not one more.',
    body: [
      'The first Qavier collection was deliberately small: a coat, a slip, a trouser, a knit — the spine of a wardrobe rather than a season of it. Each was drafted to be re-worn for a decade, in cloth chosen to age gracefully rather than fashionably.',
      'We still build this way. Restraint is not a constraint here. It is the entire point.',
    ],
    label: 'The First Collection — Archive',
    flip: true,
  },
  {
    kicker: 'The Atelier, Milan',
    title: 'Where restraint is made by hand.',
    body: [
      'Our atelier sits behind an unmarked door in Milan, supplied by the same family mills that clothe the great houses — double-faced virgin wool, sandwashed mulberry silk, grade-A Mongolian cashmere.',
      'Lapels are pick-stitched by hand. Hems are rolled, not pressed. The authenticity seal is sewn in last, by the finisher who made the piece. The details you feel before you see.',
    ],
    label: 'The Atelier, Milan',
    flip: false,
  },
];

const CODES = [
  {
    label: 'Considered',
    body: 'We design less, and we mean it. Nothing enters the collection that does not earn a permanent place in the wardrobe.',
  },
  {
    label: 'Honest Cloth',
    body: 'Italian mills, traceable leather, certified cashmere. We name our materials because we are proud of where they come from.',
  },
  {
    label: 'Made to Keep',
    body: 'Construction built to be repaired, not discarded. A Qavier piece is meant to be handed forward, not thrown away.',
  },
  {
    label: 'Quiet by Design',
    body: 'No visible logos. No noise. The only signature is the cut, and the only audience worth dressing for is yourself.',
  },
];

const CARE = [
  {
    summary: 'Shipping',
    body: 'Complimentary insured delivery worldwide, presented in Qavier archival packaging. Orders are dispatched within two business days and tracked door to door. A signature is required on receipt.',
  },
  {
    summary: 'Returns & Exchanges',
    body: 'Returns are accepted within 30 days of delivery, unworn and with the authenticity seal intact. Exchanges for size or colour are complimentary; simply reply to your order confirmation and our team will arrange collection.',
  },
  {
    summary: 'Size Guide',
    body: 'Qavier is cut to a clean, considered line — true to size with a touch of ease through the body. Between two sizes, we suggest the smaller for tailoring and the larger for knitwear and outerwear. For made-to-order pieces, our stylists will guide your measurements personally.',
  },
  {
    summary: 'Contact a Stylist',
    body: 'Our client advisors are available for private styling, sizing and care guidance, Monday to Saturday. Write to atelier@qavier.com and we will respond within one business day.',
  },
];

export default function WorldPage() {
  return (
    <>
      {/* ——————————————————————————————————————————————————————
          INTRO / MANIFESTO
         —————————————————————————————————————————————————————— */}
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-28 text-center sm:px-10 sm:pt-36 lg:pb-28">
        <Reveal>
          <p className="luxe-label text-luxe-gold">The House of Qavier</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mx-auto mt-7 max-w-4xl font-serif text-4xl font-light leading-[1.08] text-luxe-noir text-balance sm:text-6xl lg:text-7xl">
            We believe true luxury has nothing left to prove,
            <span className="text-luxe-gold"> and so it says nothing at all.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-8 max-w-2xl font-sans text-base leading-relaxed text-luxe-charcoal/80">
            Qavier is a maison built on restraint — investment pieces drawn by hand in Milan,
            cut from the finest Italian cloth, and made to outlive the season. This is the story
            of the quiet one.
          </p>
        </Reveal>
      </section>

      {/* ——————————————————————————————————————————————————————
          STORY — alternating text + imagery
         —————————————————————————————————————————————————————— */}
      <section className="border-t border-luxe-charcoal/10">
        {STORY.map((chapter, i) => (
          <div
            key={chapter.kicker}
            className={i % 2 === 1 ? 'bg-luxe-ivory/50' : undefined}
          >
            <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:gap-20 lg:py-28">
              {/* Imagery */}
              <Reveal
                y={40}
                className={chapter.flip ? 'lg:order-last' : undefined}
              >
                <PlaceholderFrame
                  universe="luxe"
                  className="aspect-[4/5] w-full shadow-luxe"
                  label={chapter.label}
                />
              </Reveal>
              {/* Copy */}
              <Reveal delay={0.1}>
                <p className="luxe-label text-luxe-gold">{chapter.kicker}</p>
                <h2 className="mt-5 font-serif text-3xl font-light leading-tight text-luxe-noir sm:text-4xl lg:text-5xl">
                  {chapter.title}
                </h2>
                {chapter.body.map((para) => (
                  <p
                    key={para.slice(0, 24)}
                    className="mt-5 max-w-md font-sans text-base leading-relaxed text-luxe-charcoal/80"
                  >
                    {para}
                  </p>
                ))}
              </Reveal>
            </div>
          </div>
        ))}
      </section>

      {/* ——————————————————————————————————————————————————————
          OUR CODES
         —————————————————————————————————————————————————————— */}
      <section className="bg-luxe-noir text-luxe-cream">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:py-32">
          <Reveal>
            <p className="luxe-label text-center text-luxe-champagne">Our Codes</p>
            <h2 className="mx-auto mt-5 max-w-2xl text-center font-serif text-4xl font-light leading-tight sm:text-5xl">
              The principles we refuse to break.
            </h2>
          </Reveal>
          <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {CODES.map((code, i) => (
              <Reveal key={code.label} delay={(i % 4) * 0.06}>
                <div className="flex flex-col">
                  <span className="font-serif text-5xl font-light text-luxe-champagne/40">
                    0{i + 1}
                  </span>
                  <p className="luxe-label mt-5 text-luxe-champagne">{code.label}</p>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-luxe-cream/60">
                    {code.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——————————————————————————————————————————————————————
          TWO UNIVERSES — sister brand note
         —————————————————————————————————————————————————————— */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:py-32">
        <Reveal>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="luxe-label text-luxe-gold">Two Universes, One House</p>
              <h2 className="mt-5 font-serif text-3xl font-light leading-tight text-luxe-noir sm:text-4xl lg:text-5xl">
                Qavier speaks in two voices.
              </h2>
              <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-luxe-charcoal/80">
                This is the quiet one. Its sister, Qavier Pops, is everything Luxe is not — loud,
                limited, and gone before you finish scrolling. Same house, opposite temperament.
                You are always welcome to cross over.
              </p>
              <Link href="/pops" className="mt-8 inline-block luxe-btn-ghost">
                Cross over to Qavier Pops →
              </Link>
            </div>
            <PlaceholderFrame
              universe="luxe"
              className="aspect-[16/10] w-full"
              label="Two Universes — Editorial"
            />
          </div>
        </Reveal>
      </section>

      {/* ——————————————————————————————————————————————————————
          CLIENT CARE
         —————————————————————————————————————————————————————— */}
      <section
        id="care"
        className="scroll-mt-24 border-t border-luxe-charcoal/10 bg-luxe-ivory/50"
      >
        <div className="mx-auto max-w-3xl px-6 py-24 sm:px-10 lg:py-32">
          <Reveal>
            <p className="luxe-label text-luxe-gold">Client Care</p>
            <h2 className="mt-5 font-serif text-4xl font-light leading-tight text-luxe-noir sm:text-5xl">
              Considered service, from cart to closet.
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-12 border-t border-luxe-charcoal/15">
              {CARE.map((row) => (
                <details
                  key={row.summary}
                  className="group border-b border-luxe-charcoal/15"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between py-6 [&::-webkit-details-marker]:hidden">
                    <span className="font-serif text-2xl font-light text-luxe-noir sm:text-3xl">
                      {row.summary}
                    </span>
                    <span
                      aria-hidden
                      className="font-serif text-3xl font-light leading-none text-luxe-stone transition-transform duration-300 ease-luxe group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-7 font-sans text-base leading-relaxed text-luxe-charcoal/80">
                    {row.body}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-14 text-center">
              <p className="font-sans text-sm text-luxe-stone">
                Still deciding? Begin with the wardrobe built to be kept.
              </p>
              <Link href="/luxe/collection" className="mt-6 inline-block luxe-btn">
                Explore the Collection
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
