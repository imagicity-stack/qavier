'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/components/shared/cart-context';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
];

/**
 * The site header: wordmark, two links, search and bag.
 *
 * Transparent over a full-bleed hero and solid once you scroll, so the home
 * page opens on the image rather than on a bar.
 */
export function SiteNav() {
  const { totalQuantity, openCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState('');

  // Only the home page has a hero to sit over.
  const overlay = pathname === '/' && !scrolled && !menuOpen && !searchOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Close everything on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = term.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
        overlay ? 'text-paper' : 'border-b border-line bg-paper/95 text-ink backdrop-blur',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-5 sm:h-20 sm:px-8">
        {/* Left — menu (mobile) */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="-ml-1 p-1 sm:hidden"
          aria-label="Open menu"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        {/* Wordmark */}
        <Link href="/" aria-label="Qavier — home" className="sm:mr-auto">
          <Logo className="h-4 w-auto sm:h-5" />
        </Link>

        {/* Centre links, desktop only */}
        <nav className="hidden items-center gap-9 sm:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'text-[0.65rem] uppercase tracking-wider2 transition-opacity hover:opacity-60',
                pathname.startsWith(l.href) && 'underline underline-offset-[6px]',
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right — search + bag */}
        <div className="flex items-center gap-4 sm:ml-auto sm:gap-5">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search"
            aria-expanded={searchOpen}
            className="p-1 transition-opacity hover:opacity-60"
          >
            <SearchIcon className="h-[1.1rem] w-[1.1rem]" />
          </button>
          <button
            type="button"
            onClick={openCart}
            aria-label={`Bag, ${totalQuantity} item${totalQuantity === 1 ? '' : 's'}`}
            className="relative p-1 transition-opacity hover:opacity-60"
          >
            <BagIcon className="h-[1.1rem] w-[1.1rem]" />
            {totalQuantity > 0 && (
              <span className="absolute -right-1.5 -top-1 text-[0.6rem] tabular-nums">
                {totalQuantity}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search bar — slides under the header */}
      {searchOpen && (
        <div className="border-t border-line bg-paper text-ink">
          <form
            onSubmit={submitSearch}
            className="mx-auto flex max-w-[90rem] items-center gap-3 px-5 py-4 sm:px-8"
          >
            <SearchIcon className="h-4 w-4 shrink-0 text-ink/40" />
            <input
              autoFocus
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search the collection"
              aria-label="Search the collection"
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink/35 focus:outline-none"
            />
            <button type="button" onClick={() => setSearchOpen(false)} className="label">
              Close
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-paper text-ink sm:hidden">
          <div className="flex h-16 items-center justify-between px-5">
            <Logo className="h-4 w-auto" />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="p-1"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col px-5 pt-6">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="border-b border-line py-5 font-display text-2xl font-light"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function BagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5 8h14l-1 12H6L5 8Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
