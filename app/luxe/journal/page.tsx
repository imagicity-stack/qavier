import type { Metadata } from 'next';
import { PlaceholderFrame } from '@/components/shared/shop-image';
import { Reveal } from '@/components/shared/reveal';

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'The Qavier Journal — style inspiration, stories and the thinking behind the house.',
};

const TABS = ['All', 'Style', 'Inspiration', 'Behind the Scenes'] as const;

const ARTICLES = [
  {
    category: 'Style',
    title: '5 Ways to Style Co-ord Sets',
    label: 'Editorial 01',
  },
  {
    category: 'Inspiration',
    title: 'Summer Edit: Breathable & Beautiful',
    label: 'Editorial 02',
  },
  {
    category: 'Behind the Scenes',
    title: 'Behind the Scenes at Qavier',
    label: 'Editorial 03',
  },
  {
    category: 'Style',
    title: 'The Quiet Power of Tailoring',
    label: 'Editorial 04',
  },
  {
    category: 'Inspiration',
    title: 'Building a Wardrobe That Lasts',
    label: 'Editorial 05',
  },
  {
    category: 'Behind the Scenes',
    title: 'Inside the Atelier: Made by Hand',
    label: 'Editorial 06',
  },
] as const;

export default function JournalPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-28 sm:px-10 sm:pt-32 lg:pb-32">
      {/* ——————————————————————————————————————————————————————
          Header
         —————————————————————————————————————————————————————— */}
      <Reveal>
        <header className="mx-auto max-w-2xl text-center">
          <p className="luxe-label text-luxe-gold">Qavier Luxe</p>
          <h1 className="mt-5 font-serif text-5xl font-light leading-[1.05] text-luxe-noir sm:text-6xl">
            Journal
          </h1>
          <p className="mt-5 font-sans text-base leading-relaxed text-luxe-charcoal/80">
            Style inspiration, stories and more.
          </p>
          <div className="luxe-rule mx-auto mt-10 max-w-xs" />
        </header>
      </Reveal>

      {/* ——————————————————————————————————————————————————————
          Tabs (visual only)
         —————————————————————————————————————————————————————— */}
      <Reveal delay={0.06}>
        <div
          aria-hidden
          className="scrollbar-none mt-10 flex justify-start gap-8 overflow-x-auto sm:justify-center"
        >
          {TABS.map((tab, i) => (
            <span
              key={tab}
              className={
                i === 0
                  ? 'luxe-label shrink-0 whitespace-nowrap border-b border-luxe-gold pb-2 text-luxe-noir'
                  : 'luxe-label shrink-0 whitespace-nowrap border-b border-transparent pb-2 text-luxe-charcoal/60'
              }
            >
              {tab}
            </span>
          ))}
        </div>
      </Reveal>

      {/* ——————————————————————————————————————————————————————
          Article cards
         —————————————————————————————————————————————————————— */}
      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {ARTICLES.map((article, i) => (
          <Reveal key={article.title} delay={(i % 3) * 0.06}>
            <article className="group">
              <PlaceholderFrame
                universe="luxe"
                className="aspect-[4/5] w-full overflow-hidden"
                label={article.label}
              />
              <p className="luxe-label mt-5 text-luxe-gold">{article.category}</p>
              <h2 className="mt-3 font-serif text-2xl font-light leading-snug text-luxe-noir">
                {article.title}
              </h2>
              <span className="luxe-label mt-4 inline-block text-luxe-charcoal">
                Read More →
              </span>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
