import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LEGAL_DOCS, LEGAL_UPDATED, getLegalDoc } from '@/lib/legal';

/** Static content — every policy is prerendered at build. */
export function generateStaticParams() {
  return LEGAL_DOCS.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const doc = getLegalDoc(params.slug);
  if (!doc) return { title: 'Not found' };
  return {
    title: doc.title,
    description: doc.summary,
    alternates: { canonical: `/legal/${doc.slug}` },
  };
}

export default function LegalPage({ params }: { params: { slug: string } }) {
  const doc = getLegalDoc(params.slug);
  if (!doc) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-14 sm:px-10 sm:py-20">
      <p className="font-sans text-[0.65rem] uppercase tracking-luxe text-luxe-gold">
        Legal
      </p>
      <h1 className="mt-4 font-serif text-3xl font-light leading-tight text-luxe-noir sm:text-4xl">
        {doc.title}
      </h1>
      <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-luxe-charcoal/80 sm:text-base">
        {doc.summary}
      </p>
      <p className="mt-4 font-sans text-xs uppercase tracking-wider2 text-luxe-stone">
        Last updated {LEGAL_UPDATED}
      </p>

      <div className="luxe-rule mt-8" />

      <div className="mt-10 flex flex-col gap-9">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-serif text-xl font-light text-luxe-noir sm:text-2xl">
              {section.heading}
            </h2>
            {section.body?.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="mt-3 font-sans text-sm leading-relaxed text-luxe-charcoal/80"
              >
                {paragraph}
              </p>
            ))}
            {section.list && (
              <ul className="mt-3 flex flex-col gap-2">
                {section.list.map((item) => (
                  <li
                    key={item.slice(0, 40)}
                    className="flex gap-3 font-sans text-sm leading-relaxed text-luxe-charcoal/80"
                  >
                    <span aria-hidden className="mt-1 shrink-0 text-luxe-gold">
                      —
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {/* Every policy reaches every other one */}
      <div className="luxe-rule mt-12" />
      <p className="mt-8 font-sans text-[0.65rem] uppercase tracking-luxe text-luxe-gold">
        More policies
      </p>
      <div className="mt-4 flex flex-wrap gap-x-7 gap-y-3">
        {LEGAL_DOCS.filter((d) => d.slug !== doc.slug).map((d) => (
          <Link
            key={d.slug}
            href={`/legal/${d.slug}`}
            className="font-sans text-sm text-luxe-charcoal underline-offset-4 transition-colors duration-300 hover:text-luxe-gold hover:underline"
          >
            {d.title}
          </Link>
        ))}
      </div>
    </article>
  );
}
