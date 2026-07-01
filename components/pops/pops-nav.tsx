'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/components/shared/cart-context';
import { cn } from '@/lib/utils';

/** Big "shop by" entries — these live in the side menu now (not on the home page). */
const SHOP_BY = [
  { href: '/pops/shop?c=women', label: 'women', accent: 'hover:text-pops-magenta' },
  { href: '/pops/shop?c=men', label: 'men', accent: 'hover:text-pops-blue' },
  { href: '/pops/shop?c=new', label: 'new arrivals', accent: 'hover:text-pops-lime' },
  { href: '/pops/shop?c=trending', label: 'trending', accent: 'hover:text-pops-violet' },
  { href: '/pops/shop?c=bestsellers', label: 'best sellers', accent: 'hover:text-pops-orange' },
  { href: '/pops/shop?c=sale', label: 'sale', accent: 'hover:text-pops-magenta' },
];

const CATEGORIES = [
  { href: '/pops/shop?c=tops', label: 'tops' },
  { href: '/pops/shop?c=bottoms', label: 'bottoms' },
  { href: '/pops/shop?c=outerwear', label: 'outerwear' },
  { href: '/pops/shop?c=footwear', label: 'footwear' },
];

const EXPLORE = [
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

  // Lock body scroll while the menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
      <nav
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border-2 border-pops-black px-3 py-2.5 transition-all duration-300 sm:px-5',
          scrolled ? 'bg-pops-paper shadow-pops' : 'bg-pops-paper/80 backdrop-blur',
        )}
      >
        {/* Left — menu button + wordmark */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMenuOpen(true)}
            className="flex items-center gap-2 rounded-full border-2 border-pops-black bg-pops-yellow px-3.5 py-2 font-display text-xs font-bold uppercase text-pops-black transition-transform hover:-translate-y-0.5"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <MenuIcon className="h-4 w-4" />
            <span className="hidden sm:inline">menu</span>
          </button>
          <Link href="/pops" className="flex items-center gap-2" aria-label="Qavier Pops home">
            <span className="font-display text-xl font-bold uppercase tracking-tight text-pops-black sm:text-2xl">
              QAVIER
            </span>
            <span className="pops-chip hidden bg-pops-lime text-pops-black sm:inline-flex">
              pops
            </span>
          </Link>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden rounded-full border-2 border-pops-black px-4 py-2 font-display text-xs font-bold uppercase text-pops-black transition-colors hover:bg-pops-violet hover:text-white sm:inline-block"
          >
            qavier ⟶
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
        </div>
      </nav>

      {/* ——————————————————————————— SIDE MENU ——————————————————————————— */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[110] bg-pops-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 z-[120] flex h-[100dvh] w-[88%] max-w-sm flex-col border-r-2 border-pops-black bg-pops-paper"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-label="Menu"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b-2 border-pops-black px-5 py-4">
                <span className="font-display text-2xl font-bold uppercase text-pops-black">
                  menu
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full border-2 border-pops-black bg-pops-magenta text-white transition-transform hover:rotate-90"
                  aria-label="Close menu"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6 scrollbar-none">
                {/* Shop by */}
                <p className="font-display text-xs font-bold uppercase tracking-widest text-pops-black/40">
                  shop by
                </p>
                <ul className="mt-3 flex flex-col">
                  {SHOP_BY.map((item, i) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i + 0.08 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          'group flex items-center justify-between border-b border-pops-black/10 py-3 font-display text-3xl font-bold uppercase leading-none text-pops-black transition-colors sm:text-4xl',
                          item.accent,
                        )}
                      >
                        {item.label}
                        <span className="translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                          ⟶
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                {/* Categories */}
                <p className="mt-8 font-display text-xs font-bold uppercase tracking-widest text-pops-black/40">
                  categories
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={() => setMenuOpen(false)}
                      className="rounded-full border-2 border-pops-black bg-pops-paper px-4 py-2 font-display text-sm font-bold uppercase text-pops-black transition-colors hover:bg-pops-lime"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>

                {/* Explore */}
                <p className="mt-8 font-display text-xs font-bold uppercase tracking-widest text-pops-black/40">
                  explore
                </p>
                <ul className="mt-3 flex flex-col gap-1">
                  {EXPLORE.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block py-2 font-display text-lg font-bold uppercase text-pops-black/80 transition-colors hover:text-pops-magenta"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Drawer footer — back to the main Qavier store */}
              <div className="border-t-2 border-pops-black p-5">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full border-2 border-pops-black bg-pops-violet px-6 py-3 font-display text-sm font-bold uppercase text-white transition-transform hover:-translate-y-0.5"
                >
                  back to qavier ⟶
                </Link>
              </div>
            </motion.aside>
          </>
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
