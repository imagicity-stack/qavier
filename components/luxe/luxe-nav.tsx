'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/components/shared/cart-context';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/luxe/collection', label: 'The Collection' },
  { href: '/luxe/world', label: 'The House' },
  { href: '/luxe#atelier', label: 'Atelier' },
];

export function LuxeNav() {
  const { totalQuantity, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-luxe',
        scrolled
          ? 'border-b border-luxe-charcoal/10 bg-luxe-cream/85 backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:py-5">
        {/* Left — desktop links */}
        <div className="hidden flex-1 items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'luxe-label transition-colors hover:text-luxe-gold',
                scrolled ? 'text-luxe-charcoal' : 'text-luxe-charcoal',
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(true)}
          className="flex items-center lg:hidden"
          aria-label="Open menu"
        >
          <MenuIcon className="h-5 w-5 text-luxe-charcoal" />
        </button>

        {/* Center — wordmark */}
        <Link
          href="/luxe"
          className="absolute left-1/2 -translate-x-1/2 text-center"
          aria-label="Qavier Luxe home"
        >
          <span className="block font-serif text-2xl font-medium tracking-[0.35em] text-luxe-noir sm:text-3xl">
            QAVIER
          </span>
          <span className="luxe-label mt-0.5 block text-luxe-gold">Luxe</span>
        </Link>

        {/* Right — actions */}
        <div className="flex flex-1 items-center justify-end gap-5">
          <Link
            href="/"
            className="luxe-label hidden text-luxe-stone transition-colors hover:text-luxe-noir sm:inline-block"
          >
            ⟶ Pops
          </Link>
          <button
            onClick={openCart}
            className="group relative flex items-center gap-2"
            aria-label="Open bag"
          >
            <span className="luxe-label hidden text-luxe-charcoal group-hover:text-luxe-gold sm:inline">
              Bag
            </span>
            <BagIcon className="h-5 w-5 text-luxe-charcoal" />
            {totalQuantity > 0 && (
              <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-luxe-gold text-[0.6rem] text-luxe-noir">
                {totalQuantity}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[120] bg-luxe-cream lg:hidden"
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
            <div className="flex flex-col gap-2 px-5 pt-10">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i + 0.1 }}
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
                href="/"
                onClick={() => setMenuOpen(false)}
                className="mt-8 luxe-label text-luxe-gold"
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
      <path
        d="M6 8h12l-1 12H7L6 8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
