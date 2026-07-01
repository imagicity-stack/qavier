'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/components/shared/cart-context';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/collection', label: 'Collections' },
  { href: '/about', label: 'About' },
  { href: '/journal', label: 'Journal' },
  { href: '/pops', label: 'Pops' },
];

export function LuxeNav() {
  const { totalQuantity } = useCart();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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

  const runSearch = (query: string) => {
    const q = query.trim();
    setMenuOpen(false);
    setSearchOpen(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-luxe',
        scrolled || searchOpen
          ? 'border-b border-luxe-charcoal/10 bg-luxe-cream/90 backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:py-5">
        {/* Left — wordmark + links */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-baseline gap-2" aria-label="Qavier home">
            <span className="font-serif text-2xl font-medium tracking-[0.32em] text-luxe-noir sm:text-3xl">
              QAVIER
            </span>
          </Link>
          <div className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="luxe-label text-luxe-charcoal transition-colors hover:text-luxe-gold"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Center — search bar (tablet / desktop) */}
        <SearchBar
          onSubmit={runSearch}
          className="mx-2 hidden max-w-xs flex-1 items-center gap-2 md:flex"
        />

        {/* Right — icons */}
        <div className="flex items-center gap-4 sm:gap-5">
          <button
            onClick={() => setSearchOpen((o) => !o)}
            aria-label="Search"
            aria-expanded={searchOpen}
            className="text-luxe-charcoal transition-colors hover:text-luxe-gold md:hidden"
          >
            <SearchIcon className="h-[1.15rem] w-[1.15rem]" />
          </button>
          <Link
            href="/about#care"
            aria-label="Client services"
            className="hidden text-luxe-charcoal transition-colors hover:text-luxe-gold sm:block"
          >
            <UserIcon className="h-[1.15rem] w-[1.15rem]" />
          </Link>
          <Link href="/cart" className="group relative" aria-label="Your bag">
            <BagIcon className="h-[1.2rem] w-[1.2rem] text-luxe-charcoal transition-colors group-hover:text-luxe-gold" />
            {totalQuantity > 0 && (
              <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-luxe-gold text-[0.6rem] text-luxe-noir">
                {totalQuantity}
              </span>
            )}
          </Link>
          <Link
            href="/pops"
            className="luxe-label hidden text-luxe-stone transition-colors hover:text-luxe-noir md:inline-block lg:hidden"
          >
            ⟶ Pops
          </Link>
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden"
            aria-label="Open menu"
          >
            <MenuIcon className="h-5 w-5 text-luxe-charcoal" />
          </button>
        </div>
      </nav>

      {/* Mobile search bar — drops in under the nav */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden md:hidden"
          >
            <div className="px-5 pb-4 sm:px-8">
              <SearchBar
                onSubmit={runSearch}
                autoFocus
                className="flex w-full items-center gap-2"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[120] flex flex-col bg-luxe-cream lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <span className="font-serif text-2xl tracking-[0.3em] text-luxe-noir">QAVIER</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <CloseIcon className="h-6 w-6 text-luxe-noir" />
              </button>
            </div>
            <div className="px-5 pt-4">
              <SearchBar
                onSubmit={runSearch}
                className="flex w-full items-center gap-2"
              />
            </div>
            <div className="flex flex-col px-5 pt-6">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.07 * i + 0.08 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-luxe-charcoal/10 py-5 font-serif text-3xl text-luxe-noir"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/cart"
                onClick={() => setMenuOpen(false)}
                className="mt-8 luxe-label text-luxe-charcoal"
              >
                Your Bag ({totalQuantity})
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function SearchBar({
  onSubmit,
  className,
  autoFocus,
}: {
  onSubmit: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState('');

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
      className={cn(
        'border-b border-luxe-charcoal/25 transition-colors focus-within:border-luxe-noir',
        className,
      )}
    >
      <button
        type="submit"
        aria-label="Search"
        className="shrink-0 text-luxe-stone transition-colors hover:text-luxe-noir"
      >
        <SearchIcon className="h-4 w-4" />
      </button>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        placeholder="Search Qavier"
        aria-label="Search products"
        className="w-full bg-transparent py-2 font-sans text-sm text-luxe-noir placeholder:text-luxe-stone/70 focus:outline-none"
      />
    </form>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function BagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
