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
    <article className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="label">Legal</p>
      <h1 className="mt-4 font-display text-2xl font-light leading-tight text-ink sm:text-3xl">
        {doc.title}
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/60">{doc.summary}</p>
      <p className="mt-4 text-[0.65rem] uppercase tracking-wider2 text-ink/40">
        Last updated {LEGAL_UPDATED}
      </p>

      <div className="mt-10 flex flex-col gap-9 border-t border-line pt-10">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-lg font-light text-ink">{section.heading}</h2>
            {section.body?.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="mt-3 text-sm leading-relaxed text-ink/65"
              >
                {paragraph}
              </p>
            ))}
            {section.list && (
              <ul className="mt-3 flex flex-col gap-2">
                {section.list.map((item) => (
                  <li
                    key={item.slice(0, 40)}
                    className="flex gap-3 text-sm leading-relaxed text-ink/65"
                  >
                    <span aria-hidden className="mt-1 shrink-0 text-ink/25">
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

      <div className="mt-12 border-t border-line pt-8">
        <p className="label">More policies</p>
        <div className="mt-4 flex flex-wrap gap-x-7 gap-y-3">
          {LEGAL_DOCS.filter((d) => d.slug !== doc.slug).map((d) => (
            <Link
              key={d.slug}
              href={`/legal/${d.slug}`}
              className="text-sm text-ink/60 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {d.title}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
