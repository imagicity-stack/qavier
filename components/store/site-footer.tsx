import Link from 'next/link';
import { Logo } from '@/components/logo';
import { LEGAL_DOCS } from '@/lib/legal';

const SHOP = [
  { href: '/shop', label: 'All pieces' },
  { href: '/shop?q=new', label: 'New in' },
  { href: '/about', label: 'About' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-[90rem] px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.4fr] lg:gap-10">
          <div>
            <Logo className="h-4 w-auto text-ink" />
            <p className="mt-5 max-w-[22rem] text-sm leading-relaxed text-ink/50">
              Considered pieces, made in small runs. Designed in India.
            </p>
          </div>

          <nav>
            <p className="label">Shop</p>
            <ul className="mt-5 flex flex-col gap-3">
              {SHOP.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink/60 transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav>
            <p className="label">Help</p>
            <ul className="mt-5 flex flex-col gap-3">
              {LEGAL_DOCS.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    href={`/legal/${doc.slug}`}
                    className="text-sm text-ink/60 transition-colors hover:text-ink"
                  >
                    {doc.nav}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label">Newsletter</p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink/50">
              New pieces and quiet announcements. Nothing else.
            </p>
            <form className="mt-5 flex items-center gap-3 border-b border-line pb-2" action="#">
              <input
                type="email"
                required
                placeholder="Email address"
                aria-label="Email address"
                className="w-full bg-transparent text-sm text-ink placeholder:text-ink/35 focus:outline-none"
              />
              <button type="submit" className="label transition-colors hover:text-ink">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink/40">
            © {new Date().getFullYear()} Qavier. All rights reserved.
          </p>
          <p className="text-xs text-ink/40">Designed and made in India.</p>
        </div>
      </div>
    </footer>
  );
}
