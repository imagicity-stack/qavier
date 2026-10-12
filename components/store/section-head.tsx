import Link from 'next/link';

/**
 * The heading that opens every home-page band: eyebrow, title, and an
 * optional link out to the full listing. One component so every section on
 * the page is set identically.
 */
export function SectionHead({
  eyebrow,
  title,
  href,
  linkLabel = 'View all',
  align = 'between',
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
  align?: 'between' | 'center';
}) {
  if (align === 'center') {
    return (
      <div className="text-center">
        {eyebrow && <p className="label">{eyebrow}</p>}
        <h2 className="h-section mt-3">{title}</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="label">{eyebrow}</p>}
        <h2 className="h-section mt-3">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 border-b border-ink/20 pb-0.5 font-display text-[0.65rem] font-bold uppercase tracking-wider2 text-ink/60 transition-colors hover:border-mint-500 hover:text-mint-600"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
