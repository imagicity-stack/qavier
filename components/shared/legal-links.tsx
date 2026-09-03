import Link from 'next/link';
import { LEGAL_DOCS } from '@/lib/legal';
import { cn } from '@/lib/utils';

/**
 * The policy links, for pages that have no full footer — the coming-soon
 * holding pages. Every page of the site has to reach these: payment providers
 * check for them, and a shopper shouldn't have to hunt.
 *
 * The flagship and Pops footers render their own styled rows instead.
 */
export function LegalLinks({
  tone = 'dark',
  className,
}: {
  /** Match the holding page it sits on. */
  tone?: 'dark' | 'light' | 'pops';
  className?: string;
}) {
  const link =
    tone === 'pops'
      ? 'font-display text-[0.65rem] font-bold uppercase tracking-widest text-pops-cream/50 hover:text-pops-lime'
      : tone === 'light'
        ? 'font-sans text-xs text-luxe-charcoal/50 hover:text-luxe-noir'
        : 'font-sans text-xs text-luxe-cream/40 hover:text-luxe-cream';

  return (
    <nav
      aria-label="Legal"
      className={cn('flex flex-wrap items-center justify-center gap-x-5 gap-y-2', className)}
    >
      {LEGAL_DOCS.map((doc) => (
        <Link
          key={doc.slug}
          href={`/legal/${doc.slug}`}
          className={cn('transition-colors', link)}
        >
          {doc.nav}
        </Link>
      ))}
    </nav>
  );
}
