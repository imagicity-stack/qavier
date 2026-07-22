'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCart } from '@/components/shared/cart-context';
import { cn } from '@/lib/utils';

// Pops lives in its own universe — it gets the poppy pill treatment below,
// so it's kept out of the quiet, minimal link list.
const LINKS = [
  { href: '/shop', label: 'T-Shirts' },
  { href: '/shop?q=new', label: 'New Arrivals' },
  { href: '/shop?q=bestseller', label: 'Bestsellers' },
  { href: '/about', label: 'About Us' },
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
    <>
      <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-luxe',
        scrolled || searchOpen
          ? 'border-b border-luxe-charcoal/10 bg-luxe-cream/90 backdrop-blur-md'
          : // Opaque on mobile from the start; only the wider header goes
            // transparent over the hero until you scroll.
            'border-b border-luxe-charcoal/10 bg-luxe-cream md:border-transparent md:bg-transparent',
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
            <LuxeLink />
            <PopsLink />
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
          <span className="hidden items-center gap-2 md:inline-flex lg:hidden">
            <LuxeLink />
            <PopsLink />
          </span>
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
      </header>

      {/* Mobile menu — rendered OUTSIDE <header> on purpose. When scrolled the
          header gets a backdrop-filter, which would make it the containing
          block for this fixed overlay and trap it inside the header's box
          (leaving the rest of the screen see-through). Kept a sibling so it
          always covers the full viewport. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[120] flex flex-col bg-luxe-cream lg:hidden"
            // Slide the opaque panel in rather than fading its opacity, so the
            // cream background never turns see-through mid-animation.
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.07 * LINKS.length + 0.08 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <LuxeLink variant="menu" onNavigate={() => setMenuOpen(false)} />
                <PopsLink variant="menu" onNavigate={() => setMenuOpen(false)} />
              </motion.div>
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
    </>
  );
}

/**
 * Qavier Luxe entry — an elegant dark pill with a champagne "Soon" tag. The
 * quiet counterpart to the loud Pops pill; links to the Luxe coming-soon page.
 */
function LuxeLink({
  variant = 'nav',
  className,
  onNavigate,
}: {
  variant?: 'nav' | 'menu';
  className?: string;
  onNavigate?: () => void;
}) {
  const isMenu = variant === 'menu';
  return (
    <Link
      href="/luxe"
      onClick={onNavigate}
      aria-label="Qavier Luxe — coming soon"
      className={cn(
        'group inline-flex items-center gap-1.5 rounded-full border border-luxe-noir bg-luxe-noir font-sans uppercase tracking-wider2 text-luxe-cream transition-colors hover:bg-luxe-charcoal',
        isMenu ? 'px-5 py-2.5 text-sm' : 'px-3.5 py-1.5 text-[0.7rem]',
        className,
      )}
    >
      Luxe
      <span
        className={cn(
          'rounded-full bg-luxe-champagne/90 font-sans leading-none text-luxe-noir',
          isMenu ? 'px-2 py-0.5 text-[0.6rem]' : 'px-1.5 py-0.5 text-[0.5rem]',
        )}
      >
        Soon
      </span>
    </Link>
  );
}

/**
 * The odd one out — a loud, neobrutalist pill that pops out of the otherwise
 * quiet nav. Clicking it fires a little "POP!" burst before crossing over to
 * the Pops universe (unless the visitor prefers reduced motion).
 */
function PopsLink({
  variant = 'nav',
  className,
  onNavigate,
}: {
  variant?: 'nav' | 'menu';
  className?: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [popping, setPopping] = useState(false);
  const isMenu = variant === 'menu';

  const handleClick = (e: React.MouseEvent) => {
    // Reduced motion (or an already-running pop): let the plain link navigate.
    if (reduceMotion || popping) {
      onNavigate?.();
      return;
    }
    e.preventDefault();
    setPopping(true);
    window.setTimeout(() => {
      onNavigate?.();
      router.push('/pops');
    }, 620);
  };

  return (
    <Link
      href="/pops"
      onClick={handleClick}
      aria-label="Enter Qavier Pops"
      className={cn(
        'group relative inline-flex items-center gap-1.5 rounded-full border-2 border-pops-black bg-pops-lime font-display font-bold uppercase tracking-tight text-pops-black shadow-pops transition-transform duration-150 hover:-translate-y-0.5 hover:-rotate-2 active:translate-y-0.5 active:shadow-none',
        isMenu ? 'px-6 py-2.5 text-lg' : 'px-3.5 py-1.5 text-xs',
        className,
      )}
    >
      <span>Pops</span>
      <motion.span
        aria-hidden
        animate={popping ? { rotate: [0, -25, 25, 0], scale: [1, 1.5, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        ✦
      </motion.span>
      <AnimatePresence>{popping && <PopBurst key="burst" />}</AnimatePresence>
    </Link>
  );
}

/**
 * Staggered, multi-colour "POP!" that bursts out of the pill on click.
 * Centred on the pill so it never clips against the top of the viewport in the
 * fixed header, then drifts up and fades as the crossover fires.
 */
function PopBurst() {
  const letters = ['P', 'O', 'P', '!'];
  const colors = ['text-pops-magenta', 'text-pops-violet', 'text-pops-cyan', 'text-pops-orange'];

  return (
    <motion.span
      className="pointer-events-none absolute left-1/2 top-1/2 z-[140] flex -translate-x-1/2 -translate-y-1/2 gap-0.5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: -14 }}
      exit={{ opacity: 0, y: -26, scale: 1.3 }}
      transition={{ duration: 0.25 }}
    >
      {letters.map((l, i) => (
        <motion.span
          key={i}
          className={cn(
            'font-display text-2xl font-black uppercase drop-shadow-[2px_2px_0_#0E0E12]',
            colors[i % colors.length],
          )}
          initial={{ y: 6, scale: 0.3, rotate: -14 }}
          animate={{ y: [6, -4, 0], scale: [0.3, 1.35, 1], rotate: [-14, 10, 0] }}
          transition={{ delay: i * 0.06, duration: 0.42, ease: 'backOut' }}
        >
          {l}
        </motion.span>
      ))}
    </motion.span>
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
