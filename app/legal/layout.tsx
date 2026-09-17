import Link from 'next/link';
import { Logo } from '@/components/logo';
import { LEGAL_DOCS } from '@/lib/legal';

/**
 * Legal pages sit at the top level, deliberately outside the store's route
 * group: the shop can be held behind a coming-soon gate, and policies must
 * stay reachable whatever that switch says — payment providers check for
 * them, and a shopper mid-purchase needs them.
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-paper text-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" aria-label="Qavier — home">
            <Logo className="h-4 w-auto text-ink" />
          </Link>
          <Link
            href="/"
            className="text-[0.65rem] uppercase tracking-wider2 text-ink/45 transition-colors hover:text-ink"
          >
            ← Back to store
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-xs text-ink/40">
            © {new Date().getFullYear()} Qavier. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_DOCS.map((doc) => (
              <Link
                key={doc.slug}
                href={`/legal/${doc.slug}`}
                className="text-xs text-ink/45 transition-colors hover:text-ink"
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
