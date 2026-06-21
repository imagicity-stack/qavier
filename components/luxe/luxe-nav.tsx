'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/components/shared/cart-context';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/luxe/shop', label: 'Shop' },
  { href: '/luxe/collection', label: 'Collections' },
  { href: '/luxe/about', label: 'About' },
  { href: '/luxe/journal', label: 'Journal' },
];

export function LuxeNav() {
  const { totalQuantity } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-luxe',
        scrolled
          ? 'border-b border-luxe-charcoal/10 bg-luxe-cream/90 backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:py-5">
        {/* Left — wordmark + links */}
        <div className="flex items-center gap-10">
          <Link href="/luxe" className="flex items-baseline gap-2" aria-label="Qavier Luxe home">
            <span className="font-serif text-2xl font-medium tracking-[0.32em] text-luxe-noir sm:text-3xl">
              QAVIER
            </span>
            <span className="luxe-label hidden text-luxe-gold sm:inline">Luxe</span>
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

        {/* Right — icons */}
        <div className="flex items-center gap-5">
          <Link
            href="/luxe/shop"
            aria-label="Search the collection"
            className="hidden text-luxe-charcoal transition-colors hover:text-luxe-gold sm:block"
          >
            <SearchIcon className="h-[1.15rem] w-[1.15rem]" />
          </Link>
          <Link
            href="/luxe/about#care"
            aria-label="Client services"
            className="hidden text-luxe-charcoal transition-colors hover:text-luxe-gold sm:block"
          >
            <UserIcon className="h-[1.15rem] w-[1.15rem]" />
          </Link>
          <Link href="/luxe/cart" className="group relative" aria-label="Your bag">
            <BagIcon className="h-[1.2rem] w-[1.2rem] text-luxe-charcoal transition-colors group-hover:text-luxe-gold" />
            {totalQuantity > 0 && (
              <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-luxe-gold text-[0.6rem] text-luxe-noir">
                {totalQuantity}
              </span>
            )}
          </Link>
          <Link
            href="/"
            className="luxe-label hidden text-luxe-stone transition-colors hover:text-luxe-noir md:inline-block"
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
            <div className="flex flex-col px-5 pt-8">
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
                href="/luxe/cart"
                onClick={() => setMenuOpen(false)}
                className="mt-8 luxe-label text-luxe-charcoal"
              >
                Your Bag ({totalQuantity})
              </Link>
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="mt-4 luxe-label text-luxe-gold"
              >
                ⟶ Cross over to Qavier Pops
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
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
