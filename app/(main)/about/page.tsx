import type { Metadata } from 'next';
import Link from 'next/link';
import { PlaceholderFrame } from '@/components/shared/shop-image';
import { Reveal } from '@/components/shared/reveal';
import { SizeChartTable } from '@/components/shared/size-chart';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Qavier is a contemporary house making considered pieces in small runs, designed and made in India.',
};

const PILLARS = [
  {
    title: 'Small runs',
    body: 'Each design is cut in a limited quantity. No restocks, no overproduction.',
  },
  {
    title: 'Made in India',
    body: 'Cut, printed and finished locally, by people we know by name.',
  },
  {
    title: 'Built to keep',
    body: 'Heavier cloth and honest construction, so a piece outlasts the season.',
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-5 pb-16 pt-28 text-center sm:px-8 sm:pt-36">
        <Reveal>
          <p className="label">About</p>
          <h1 className="mt-5 font-display text-3xl font-light leading-tight text-ink text-balance sm:text-4xl">
            A quiet house, making fewer and better things.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-ink/60">
            Qavier began with one conviction: that a wardrobe should be built
            slowly, from pieces worth keeping. Everything is designed in-house and
            made in small runs.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[90rem] px-5 sm:px-8">
        <Reveal>
          <PlaceholderFrame className="aspect-[16/9] w-full" label="The atelier" />
        </Reveal>
      </section>

      <section className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 sm:grid-cols-3 sm:gap-10">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <h2 className="label">{p.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink/60">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="size-guide" className="scroll-mt-28 border-y border-line bg-shell">
        <div className="mx-auto max-w-2xl px-5 py-20 sm:px-8 sm:py-24">
          <Reveal>
            <p className="label">Size guide</p>
            <h2 className="mt-4 font-display text-2xl font-light text-ink">
              Garment measurements
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/55">
              Measured flat, across the garment — not the body. Our fits run
              oversized by design.
            </p>
            <SizeChartTable className="mt-8" />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8 sm:py-24">
        <Reveal>
          <p className="text-sm leading-relaxed text-ink/60">
            Questions about an order, a size or a return?
          </p>
          <Link href="/legal/contact" className="btn-ghost mt-7">
            Contact us
          </Link>
        </Reveal>
      </section>
    </>
  );
}
