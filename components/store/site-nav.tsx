'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/components/shared/cart-context';
import { ShopImage } from '@/components/shared/shop-image';
import { Wordmark } from '@/components/logo';
import { ProductCard } from '@/components/store/product-card';
import type { NavItem } from '@/lib/nav';
import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

/**
 * The store header.
 *
 * Desktop: departments on the left, the wordmark centred, and the utilities
 * on the right — currency, search, account, bag. Hovering a department opens
 * its mega-menu: link columns on the left half, four featured products on the
 * right.
 *
 * Mobile: menu and search on the left, wordmark centred, account and bag on
 * the right. The menu is a drawer from the left that drills into each
 * department.
 *
 * `items` and `featured` are built from the store's collections in the
 * layout, so this component holds no category list of its own.
 */
export function SiteNav({
  items,
  featured,
  trending,
  accountHref,
}: {
  items: NavItem[];
  /** Products for each department's panel, keyed by collection handle. */
  featured: Record<string, Product[]>;
  /** Shown in the search panel before anything is typed. */
  trending: Product[];
  accountHref: string;
}) {
  const { totalQuantity, openCart } = useCart();
  const pathname = usePathname();

  /** Which department's mega-panel is open (desktop). */
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimer = useRef<number>();

  const open = items.find((i) => i.label === openLabel && i.groups?.length);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
      setOpenLabel(null);
      setSearchOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Close everything on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setOpenLabel(null);
  }, [pathname]);

  // A short grace period on leave, so a diagonal mouse path from the bar to
  // the panel doesn't flicker it shut.
  const hover = (label: string | null) => {
    window.clearTimeout(closeTimer.current);
    setOpenLabel(label);
  };
  const leave = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenLabel(null), 120);
  };

  // Exact match: every department is its own collection page, and a prefix
  // match would light "Collections" on all of them.
  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper text-ink">
      <div onMouseLeave={leave}>
        <div className="relative flex h-16 items-center bg-paper px-4 sm:px-6 lg:h-[4.5rem] lg:px-10">
          {/* Left — mobile: menu + search */}
          <div className="flex items-center gap-1 lg:hidden">
            <IconButton label="Open menu" onClick={() => setMenuOpen(true)}>
              <MenuIcon />
            </IconButton>
            <IconButton
              label="Search"
              expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
            >
              <SearchIcon />
            </IconButton>
          </div>

          {/* Left — desktop: departments */}
          <nav className="hidden items-center gap-5 lg:flex xl:gap-6" aria-label="Main">
            {items.map((item) => {
              const hasPanel = Boolean(item.groups?.length);
              const lit = openLabel === item.label || isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => hover(hasPanel ? item.label : null)}
                  onFocus={() => hover(hasPanel ? item.label : null)}
                  aria-expanded={hasPanel ? openLabel === item.label : undefined}
                  className={cn(
                    'py-2 text-[0.9rem] underline-offset-[6px] transition-colors',
                    item.accent ? 'text-sale' : 'text-ink',
                    lit ? 'underline decoration-1' : 'hover:underline hover:decoration-1',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Centre — the wordmark */}
          <Link
            href="/"
            aria-label="Qavier — home"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Wordmark priority className="h-[1.35rem] sm:h-6 lg:h-7" />
          </Link>

          {/* Right — utilities */}
          <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
            <span className="mr-3 hidden text-[0.85rem] xl:inline">INR ₹ | English</span>
            <span className="hidden lg:block">
              <IconButton
                label="Search"
                expanded={searchOpen}
                onClick={() => setSearchOpen((v) => !v)}
              >
                <SearchIcon />
              </IconButton>
            </span>
            <Link
              href={accountHref}
              aria-label="Account"
              className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-60"
            >
              <AccountIcon />
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Bag, ${totalQuantity} item${totalQuantity === 1 ? '' : 's'}`}
              className="relative flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-60"
            >
              <BagIcon />
              {totalQuantity > 0 && (
                <span className="absolute right-0.5 top-1 flex h-[1.05rem] min-w-[1.05rem] items-center justify-center rounded-full bg-ink px-1 text-[0.6rem] font-bold tabular-nums text-paper">
                  {totalQuantity}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mega-panel — desktop only */}
        <AnimatePresence>
          {open && (
            <motion.div
              key={open.label}
              onMouseEnter={() => hover(open.label)}
              className="absolute inset-x-0 top-full hidden max-h-[calc(100vh-7rem)] overflow-y-auto border-b border-line bg-paper shadow-[0_24px_40px_-32px_rgba(0,0,0,0.35)] lg:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              <MegaPanel item={open} products={open.featured ? featured[open.featured] : undefined} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search panel — drops under the bar */}
      <AnimatePresence>
        {searchOpen && (
          <SearchPanel trending={trending} onClose={() => setSearchOpen(false)} />
        )}
      </AnimatePresence>

      {/* Mobile drawer — slides in from the left */}
      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            items={items}
            featured={featured}
            accountHref={accountHref}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );
}

// ——— Desktop mega-panel ————————————————————————————————————————————

function MegaPanel({ item, products }: { item: NavItem; products?: Product[] }) {
  const cards = products?.slice(0, 4) ?? [];
  const tiles = cards.length ? [] : item.tiles ?? [];

  return (
    <div className="grid gap-10 px-10 pb-12 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
      <div className="grid grid-cols-2 gap-x-10 gap-y-8 xl:grid-cols-[repeat(2,minmax(0,18rem))]">
        {item.groups!.map((group) => (
          <div key={group.heading} className="min-w-0">
            <p className="label">{group.heading}</p>
            <ul className="mt-5 flex flex-col gap-[0.95rem]">
              {group.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-[0.9rem] text-ink underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {cards.length > 0 && (
        <div className="grid grid-cols-4 gap-2.5">
          {cards.map((product) => (
            <ProductCard key={product.id} product={product} compact sizes="16vw" />
          ))}
        </div>
      )}

      {tiles.length > 0 && (
        <div className="grid grid-cols-2 gap-2.5">
          {tiles.map((tile) => (
            <Link key={tile.href} href={tile.href} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden bg-shell">
                <ShopImage
                  image={tile.image}
                  sizes="30vw"
                  className="absolute inset-0 h-full w-full transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
                  label={tile.title}
                />
              </div>
              <p className="label mt-3 inline-block border-b border-ink pb-1">{tile.title}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ——— Search ————————————————————————————————————————————————————————

const POPULAR = ['Polos', 'T-Shirts', 'Hoodies', 'Golf', 'Shorts', 'Caps'];

function SearchPanel({ trending, onClose }: { trending: Product[]; onClose: () => void }) {
  const router = useRouter();
  const [term, setTerm] = useState('');

  const go = (q: string) => {
    onClose();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[-1] bg-ink/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-6rem)] overflow-y-auto border-b border-line bg-paper"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              go(term.trim());
            }}
            className="flex items-center gap-3 border-b border-ink pb-3"
          >
            <SearchIcon />
            <input
              autoFocus
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="What are you looking for?"
              aria-label="Search the store"
              className="w-full bg-transparent font-serif text-xl text-ink placeholder:text-mute focus:outline-none sm:text-2xl"
            />
            <button type="button" onClick={onClose} className="shrink-0 text-[0.85rem] hover:underline">
              Close
            </button>
          </form>

          <div className="mt-6 grid gap-8 lg:grid-cols-[16rem_1fr]">
            <div>
              <p className="label">Popular searches</p>
              <ul className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:gap-3">
                {POPULAR.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      onClick={() => go(q)}
                      className="rounded-full border border-line px-3.5 py-1.5 text-[0.85rem] hover:border-ink lg:rounded-none lg:border-0 lg:p-0 lg:hover:underline"
                    >
                      {q}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {trending.length > 0 && (
              <div>
                <p className="label">Trending now</p>
                <div className="mt-4 grid grid-cols-2 gap-x-2.5 gap-y-6 sm:grid-cols-4">
                  {trending.slice(0, 4).map((p) => (
                    <ProductCard key={p.id} product={p} compact sizes="(max-width: 640px) 50vw, 20vw" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ——— Mobile drawer ——————————————————————————————————————————————————

function MobileMenu({
  items,
  featured,
  accountHref,
  onClose,
}: {
  items: NavItem[];
  featured: Record<string, Product[]>;
  accountHref: string;
  onClose: () => void;
}) {
  const [panel, setPanel] = useState<NavItem | null>(null);

  return (
    <div className="lg:hidden">
      <motion.div
        className="fixed inset-0 z-[60] bg-ink/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="fixed left-0 top-0 z-[70] flex h-[100dvh] w-[88%] max-w-sm flex-col overflow-hidden bg-paper text-ink"
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
          <Wordmark className="h-[1.3rem]" />
          <IconButton label="Close menu" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className="relative flex-1 overflow-hidden">
          {/* Level one — departments */}
          <div className="absolute inset-0 overflow-y-auto overscroll-contain px-4 pb-10">
            <nav className="flex flex-col">
              {items.map((item) =>
                item.groups?.length ? (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setPanel(item)}
                    className="flex items-center justify-between border-b border-line py-4 text-left text-base"
                  >
                    {item.label}
                    <ChevronIcon className="h-4 w-4" />
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      'border-b border-line py-4 text-base',
                      item.accent && 'text-sale',
                    )}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>

            <div className="mt-8 flex flex-col gap-4 text-[0.9rem]">
              <Link href={accountHref} className="flex items-center gap-3">
                <AccountIcon /> My Account
              </Link>
              <Link href="/legal/contact" className="flex items-center gap-3">
                <HelpIcon /> Contact Us
              </Link>
              <span className="flex items-center gap-3 text-mute">
                <GlobeIcon /> INR ₹ | English
              </span>
            </div>
          </div>

          {/* Level two — one department */}
          <AnimatePresence>
            {panel && (
              <motion.div
                className="absolute inset-0 overflow-y-auto overscroll-contain bg-paper px-4 pb-10"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  onClick={() => setPanel(null)}
                  className="flex w-full items-center gap-2 border-b border-line py-4 text-base"
                >
                  <ChevronIcon className="h-4 w-4 rotate-180" />
                  {panel.label}
                </button>

                {panel.groups!.map((group) => (
                  <div key={group.heading} className="mt-6">
                    <p className="label">{group.heading}</p>
                    <ul className="mt-3 flex flex-col">
                      {group.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link href={link.href} className="block py-2.5 text-[0.95rem]">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {panel.featured && featured[panel.featured]?.length ? (
                  <div className="mt-8">
                    <p className="label">Featured</p>
                    <div className="scrollbar-none -mx-4 mt-4 flex gap-2.5 overflow-x-auto px-4">
                      {featured[panel.featured].slice(0, 4).map((p) => (
                        <div key={p.id} className="w-[44%] shrink-0">
                          <ProductCard product={p} compact sizes="45vw" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </div>
  );
}

// ——— Icons ——————————————————————————————————————————————————————————

function IconButton({
  label,
  onClick,
  expanded,
  children,
}: {
  label: string;
  onClick: () => void;
  expanded?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={expanded}
      className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-60"
    >
      {children}
    </button>
  );
}

const ICON = 'h-[1.35rem] w-[1.35rem]';

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={ICON} aria-hidden>
      <path d="M3 6.5h18M3 12h18M3 17.5h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={ICON} aria-hidden>
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn(ICON, 'shrink-0')} aria-hidden>
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={ICON} aria-hidden>
      <circle cx="12" cy="7.5" r="4" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M4.5 21v-1.5A5.5 5.5 0 0 1 10 14h4a5.5 5.5 0 0 1 5.5 5.5V21"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={ICON} aria-hidden>
      <path d="M4.5 8h15v13h-15V8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={ICON} aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M9.75 9.5a2.25 2.25 0 1 1 3.4 1.94c-.7.42-1.15.95-1.15 1.76v.3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.6" r="0.9" fill="currentColor" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={ICON} aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.2 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.2-3.5-8.5S9.6 5.9 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
