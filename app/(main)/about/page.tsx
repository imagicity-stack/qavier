import type { Metadata } from 'next';
import Link from 'next/link';
import { PlaceholderFrame } from '@/components/shared/shop-image';
import { Reveal } from '@/components/shared/reveal';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Qavier is a contemporary womenswear house celebrating minimalism, quality and timeless design — pieces made to empower women in every moment.',
};

const FEATURES = [
  {
    title: 'Premium Quality',
    body: 'Finest fabrics and craftsmanship.',
    Icon: GemIcon,
  },
  {
    title: 'Timeless Design',
    body: 'Styles that transcend trends.',
    Icon: InfinityIcon,
  },
  {
    title: 'Made for You',
    body: 'Thoughtfully designed for modern women.',
    Icon: HeartIcon,
  },
] as const;

const CARE = [
  {
    summary: 'Shipping & Delivery',
    body: 'Complimentary insured delivery, presented in Qavier archival packaging. Orders are dispatched within two business days and arrive within three to five.',
  },
  {
    summary: 'Returns & Exchanges',
    body: 'Returns and exchanges accepted within 30 days, unworn and with the authenticity seal intact. We arrange a complimentary collection at your convenience.',
  },
  {
    summary: 'Size Guide',
    body: 'Each piece is cut true to size with a considered, easy fit. Between sizes, we recommend sizing up for tailoring and down for knitwear. Our stylists are happy to advise.',
  },
  {
    summary: 'FAQs',
    body: 'From fabric origins to alterations and gifting, our most-asked questions are answered here. For anything further, a stylist is only a message away.',
  },
  {
    summary: 'Contact a Stylist',
    body: 'Personal styling, by appointment or correspondence. Write to us and a Qavier stylist will help you build a wardrobe that lasts.',
  },
] as const;

export default function AboutPage() {
  return (
    <>
      {/* ——————————————————————————————————————————————————————
          Intro
         —————————————————————————————————————————————————————— */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-28 sm:px-10 sm:pt-32 lg:pb-28">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div>
              <p className="luxe-label text-luxe-gold">About Qavier</p>
              <h1 className="mt-5 font-serif text-5xl font-light leading-[1.05] text-luxe-noir sm:text-6xl">
                About Qavier
              </h1>
              <p className="mt-7 max-w-md font-sans text-base leading-relaxed text-luxe-charcoal/80">
                Qavier is a contemporary womenswear brand that celebrates minimalism,
                quality and timeless design. We create pieces that empower women to feel
                confident in every moment.
              </p>
              <Link href="#story" className="luxe-btn mt-10">
                Our Story
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <PlaceholderFrame
              universe="luxe"
              className="aspect-[3/4] w-full"
              label="Portrait — The Qavier Woman"
            />
          </Reveal>
        </div>
      </section>

      {/* ——————————————————————————————————————————————————————
          Brand story
         —————————————————————————————————————————————————————— */}
      <section id="story" className="scroll-mt-24 bg-luxe-ivory/60">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <PlaceholderFrame
                universe="luxe"
                className="aspect-[4/5] w-full"
                label="The Atelier — In the Making"
              />
            </Reveal>
            <Reveal delay={0.08}>
              <div>
                <p className="luxe-label text-luxe-stone">Our Story</p>
                <h2 className="mt-5 font-serif text-3xl font-light leading-tight text-luxe-noir sm:text-4xl">
                  Considered, never disposable
                </h2>
                <p className="mt-6 font-sans text-base leading-relaxed text-luxe-charcoal/80">
                  We began with a single conviction: that a wardrobe should be built
                  slowly, from pieces worth keeping. Every Qavier garment is designed in
                  -house and made in limited runs.
                </p>
                <p className="mt-4 font-sans text-base leading-relaxed text-luxe-charcoal/80">
                  Fewer, finer things — cut from natural fabrics and finished by hand, so
                  they feel as considered as they look.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ——————————————————————————————————————————————————————
          Features
         —————————————————————————————————————————————————————— */}
      <section className="bg-luxe-noir text-luxe-cream">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:py-28">
          <Reveal>
            <div className="mx-auto max-w-xl text-center">
              <p className="luxe-label text-luxe-champagne">The House</p>
              <h2 className="mt-5 font-serif text-3xl font-light text-luxe-cream sm:text-4xl">
                What we stand for
              </h2>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-12 sm:grid-cols-3 sm:gap-8">
            {FEATURES.map(({ title, body, Icon }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="flex flex-col items-center text-center">
                  <Icon className="h-8 w-8 text-luxe-champagne" />
                  <h3 className="luxe-label mt-6 text-luxe-cream">{title}</h3>
                  <p className="mt-3 max-w-[16rem] font-sans text-sm leading-relaxed text-luxe-cream/70">
                    {body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——————————————————————————————————————————————————————
          Care & assistance
         —————————————————————————————————————————————————————— */}
      <section id="care" className="scroll-mt-24">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:px-10 lg:py-28">
          <Reveal>
            <div className="text-center">
              <p className="luxe-label text-luxe-gold">Care &amp; Assistance</p>
              <h2 className="mt-5 font-serif text-3xl font-light text-luxe-noir sm:text-4xl">
                Here to help
              </h2>
              <div className="luxe-rule mx-auto mt-10 max-w-xs" />
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="mt-12 border-t border-luxe-charcoal/10">
              {CARE.map((row) => (
                <details
                  key={row.summary}
                  className="group border-b border-luxe-charcoal/10"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between py-6 [&::-webkit-details-marker]:hidden">
                    <span className="luxe-label text-luxe-charcoal">{row.summary}</span>
                    <ChevronIcon className="h-4 w-4 shrink-0 text-luxe-stone transition-transform duration-500 ease-luxe group-open:rotate-180" />
                  </summary>
                  <p className="pb-7 font-sans text-sm leading-relaxed text-luxe-stone">
                    {row.body}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ——————————————————————————————————————————————————————
   Inline icons
   —————————————————————————————————————————————————————— */
function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GemIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M6 3h12l3 6-9 12L3 9l3-6Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M3 9h18M9 3 7.5 9 12 21M15 3l1.5 6L12 21" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function InfinityIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M6.5 9a3 3 0 1 0 0 6c1.7 0 2.7-1.3 3.7-2.6l1.8-2.4c1-1.3 2-2.6 3.7-2.6a3 3 0 1 1 0 6c-1.7 0-2.7-1.3-3.7-2.6l-1.8-2.4C9.2 10.3 8.2 9 6.5 9Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 20s-7-4.3-9.3-8.4C1.3 9 2.3 5.8 5.3 5.1c1.9-.4 3.6.5 4.7 2 1.1-1.5 2.8-2.4 4.7-2 3 .7 4 3.9 2.6 6.5C19 15.7 12 20 12 20Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
