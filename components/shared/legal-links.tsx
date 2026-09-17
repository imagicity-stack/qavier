import Link from 'next/link';
import { LEGAL_DOCS } from '@/lib/legal';
import { cn } from '@/lib/utils';

/**
 * The policy links, for pages that have no full footer — the holding page.
 * Every page of the site has to reach these: payment providers check for them,
 * and a shopper shouldn't have to hunt.
 */
export function LegalLinks({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Legal"
      className={cn('flex flex-wrap items-center justify-center gap-x-5 gap-y-2', className)}
    >
      {LEGAL_DOCS.map((doc) => (
        <Link
          key={doc.slug}
          href={`/legal/${doc.slug}`}
          className="text-xs text-paper/40 transition-colors hover:text-paper"
        >
          {doc.nav}
        </Link>
      ))}
    </nav>
  );
}
