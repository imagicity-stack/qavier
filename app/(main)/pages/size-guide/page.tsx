import type { Metadata } from 'next';
import { SizeChartTable } from '@/components/shared/size-chart';

export const metadata: Metadata = {
  title: 'Size Guide',
  description: 'Garment measurements for every Qavier size, in inches and centimetres.',
};

const HOW_TO = [
  {
    title: 'Chest',
    body: 'Measure across the garment from armpit to armpit, laid flat.',
  },
  {
    title: 'Length',
    body: 'Measure from the highest point of the shoulder down to the hem.',
  },
  {
    title: 'Shoulder',
    body: 'Measure straight across the back, from one shoulder seam to the other.',
  },
  {
    title: 'Sleeve',
    body: 'Measure from the shoulder seam to the end of the sleeve.',
  },
];

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
      <h1 className="h-page text-center">Size Guide</h1>
      <p className="mx-auto mt-4 max-w-xl text-center text-[0.95rem] leading-relaxed text-mute">
        Measurements are of the garment, laid flat — not the body. Compare them with a piece you
        already own and love the fit of.
      </p>

      <section className="mt-12">
        <h2 className="font-serif text-[1.4rem]">Tops</h2>
        <SizeChartTable className="mt-4" />
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-[1.4rem]">How to measure</h2>
        <dl className="mt-5 grid gap-6 sm:grid-cols-2">
          {HOW_TO.map((m) => (
            <div key={m.title} className="border-t border-line pt-4">
              <dt className="label">{m.title}</dt>
              <dd className="mt-2 text-[0.9rem] leading-relaxed text-ink/80">{m.body}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
