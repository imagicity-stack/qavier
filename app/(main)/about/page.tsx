import type { Metadata } from 'next';
import Link from 'next/link';
import { ShopImage } from '@/components/shared/shop-image';
import { Reveal } from '@/components/shared/reveal';

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
      <section className="mx-auto max-w-3xl px-5 pb-14 pt-12 text-center sm:px-8 sm:pt-16">
        <Reveal>
          <h1 className="h-page text-balance">A quiet house, making fewer and better things.</h1>
          <p className="mx-auto mt-5 max-w-xl text-[0.95rem] leading-relaxed text-mute">
            Qavier began with one conviction: that a wardrobe should be built slowly, from
            pieces worth keeping. Everything is designed in-house and made in small runs.
          </p>
        </Reveal>
      </section>

      <section className="px-4 sm:px-6 lg:px-10">
        <Reveal>
          <ShopImage
            image={{
              url: '/images/desktop_qavier.png',
              altText: 'Qavier campaign',
              width: 1586,
              height: 992,
            }}
            sizes="100vw"
            priority
            className="aspect-[4/5] w-full sm:aspect-[16/8]"
            position="40% center"
          />
        </Reveal>
      </section>

      <section id="story" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-10">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <h2 className="font-serif text-[1.5rem]">{p.title}</h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-mute">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-line px-5 py-16 text-center sm:py-20">
        <Reveal>
          <p className="font-serif text-[1.5rem]">Questions about an order, a size or a return?</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            <Link href="/legal/contact" className="btn-dark">
              Contact Us
            </Link>
            <Link href="/pages/faq" className="btn-ghost">
              Read the FAQs
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
