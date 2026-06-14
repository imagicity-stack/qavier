'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/components/shared/cart-context';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/pops/shop', label: 'shop all' },
  { href: '/pops/drops', label: 'drops' },
  { href: '/pops#feed', label: 'the feed' },
];

export function PopsNav() {
  const { totalQuantity, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
      <nav
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border-2 border-pops-black px-4 py-2.5 transition-all duration-300 sm:px-6',
          scrolled ? 'bg-pops-paper shadow-pops' : 'bg-pops-paper/80 backdrop-blur',
        )}
      >
        {/* Wordmark */}
        <Link href="/pops" className="flex items-center gap-2" aria-label="Qavier Pops home">
          <span className="font-display text-xl font-bold uppercase tracking-tight text-pops-black sm:text-2xl">
            QAVIER
          </span>
          <span className="pops-chip bg-pops-lime text-pops-black">pops</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 font-display text-sm font-bold uppercase text-pops-black transition-colors hover:bg-pops-yellow"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden rounded-full border-2 border-pops-black px-4 py-2 font-display text-xs font-bold uppercase text-pops-black transition-colors hover:bg-pops-violet hover:text-white sm:inline-block"
          >
            luxe ⟶
          </Link>
          <button
            onClick={openCart}
            className="relative grid h-10 w-10 place-items-center rounded-full border-2 border-pops-black bg-pops-cyan transition-transform hover:-translate-y-0.5"
            aria-label="Open bag"
          >
            <BagIcon className="h-5 w-5 text-pops-black" />
            {totalQuantity > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full border-2 border-pops-black bg-pops-magenta text-[0.65rem] font-bold text-white">
                {totalQuantity}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full border-2 border-pops-black bg-pops-yellow md:hidden"
            aria-label="Open menu"
          >
            <MenuIcon className="h-5 w-5 text-pops-black" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[120] flex flex-col bg-pops-magenta text-white md:hidden"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
          >
            <div className="grain absolute inset-0 opacity-20" />
            <div className="relative flex items-center justify-between px-5 py-5">
              <span className="font-display text-2xl font-bold uppercase">menu</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full border-2 border-white"
                aria-label="Close menu"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="relative flex flex-1 flex-col justify-center gap-2 px-6">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.05 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block font-display text-5xl font-bold uppercase leading-tight hover:text-pops-lime"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="mt-10 inline-flex w-fit items-center gap-2 rounded-full border-2 border-white px-6 py-3 font-display text-base font-bold uppercase"
              >
                cross over to luxe ⟶
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
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
function BagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
