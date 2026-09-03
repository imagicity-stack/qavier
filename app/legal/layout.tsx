import Link from 'next/link';
import { Logo } from '@/components/logo';
import { LEGAL_DOCS } from '@/lib/legal';

/**
 * Legal pages sit at the top level, deliberately outside every world's route
 * group. The flagship and Pops route groups each hide behind a coming-soon
 * gate, and policies must stay reachable whatever those switches say — payment
 * providers check for them, and a shopper mid-purchase needs them.
 *
 * Kept in the house style rather than either world's skin, so one canonical
 * copy serves the whole site.
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-luxe-cream font-sans text-luxe-noir">
      <header className="border-b border-luxe-charcoal/10">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5 sm:px-10">
          <Link href="/" aria-label="Qavier home">
            <Logo className="h-5 w-auto text-luxe-noir" />
          </Link>
          <Link
            href="/"
            className="font-sans text-[0.7rem] uppercase tracking-wider2 text-luxe-stone transition-colors hover:text-luxe-noir"
          >
            ← Back to store
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-luxe-charcoal/10">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <p className="font-sans text-xs text-luxe-stone">
            © {new Date().getFullYear()} Qavier. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_DOCS.map((doc) => (
              <Link
                key={doc.slug}
                href={`/legal/${doc.slug}`}
                className="font-sans text-xs text-luxe-stone transition-colors hover:text-luxe-noir"
              >
                {doc.nav}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
