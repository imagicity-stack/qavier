'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/components/shared/cart-context';
import { ShopImage } from '@/components/shared/shop-image';
import { Logo } from '@/components/logo';
import { LEGAL_DOCS } from '@/lib/legal';
import type { NavItem } from '@/lib/nav';
import { cn } from '@/lib/utils';

/**
 * The store header: logo, mega-menu, search, bag.
 *
 * Solid and sticky rather than transparent over the hero — a shop's header is
 * a tool, and it should look like one on every page, including the home page.
 * That also means pages sit in normal flow underneath it with no top-padding
 * to keep in sync.
 *
 * `items` is built from the store's own Shopify collections in the layout, so
 * this component holds no category list of its own.
 */
export function SiteNav({ items }: { items: NavItem[] }) {
  const { totalQuantity, openCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  /** Which top-level item's mega-panel is open (desktop). */
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState('');

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

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = term.trim();
    setSearchOpen(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
  }

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper text-ink">
      {/* One leave handler for the bar and its panel, so moving the pointer
          down into the panel doesn't close it. */}
      <div onMouseLeave={() => setOpenLabel(null)}>
        <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-4 px-5 sm:h-20 sm:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="-ml-1 p-1 lg:hidden"
            aria-label="Open menu"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <Link href="/" aria-label="Qavier — home" className="shrink-0">
            <Logo priority className="h-9 sm:h-11" />
          </Link>

          {/* Desktop nav */}
          <nav className="ml-6 hidden items-center gap-7 lg:flex" aria-label="Main">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onMouseEnter={() => setOpenLabel(item.groups?.length ? item.label : null)}
                onFocus={() => setOpenLabel(item.groups?.length ? item.label : null)}
                aria-expanded={item.groups?.length ? openLabel === item.label : undefined}
                className={cn(
                  'relative py-2 font-display text-[0.7rem] font-bold uppercase tracking-wider2 transition-colors',
                  item.accent ? 'text-sale hover:text-sale/80' : 'hover:text-mint-600',
                  isActive(item.href) && !item.accent && 'text-mint-600',
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    'absolute inset-x-0 -bottom-px h-[2px] origin-left bg-mint-500 transition-transform duration-200',
                    openLabel === item.label || isActive(item.href)
                      ? 'scale-x-100'
                      : 'scale-x-0',
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              aria-expanded={searchOpen}
              className="p-1.5 transition-colors hover:text-mint-600"
            >
              <SearchIcon className="h-[1.15rem] w-[1.15rem]" />
            </button>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Bag, ${totalQuantity} item${totalQuantity === 1 ? '' : 's'}`}
              className="relative p-1.5 transition-colors hover:text-mint-600"
            >
              <BagIcon className="h-[1.15rem] w-[1.15rem]" />
              {totalQuantity > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full bg-mint-500 px-1 text-[0.6rem] font-bold tabular-nums text-ink">
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
              className="absolute inset-x-0 top-full hidden border-b border-line bg-paper shadow-[0_18px_40px_-28px_rgba(12,35,27,0.35)] lg:block"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <div className="mx-auto grid max-w-[90rem] gap-10 px-8 py-10 lg:grid-cols-[1fr_17rem]">
                {/* One column per group, up to four — a fourth group wrapping
                    onto its own row left a hole in the middle of the panel. */}
                <div
                  className={cn(
                    'grid gap-8',
                    open.groups!.length >= 4 && 'grid-cols-4',
                    open.groups!.length === 3 && 'grid-cols-3',
                    open.groups!.length <= 2 && 'grid-cols-2',
                  )}
                >
                  {open.groups!.map((group) => (
                    <div key={group.heading} className="min-w-0">
                      <p className="label">{group.heading}</p>
                      <ul className="mt-4 flex flex-col gap-2.5">
                        {group.links.map((link) => (
                          <li key={link.href + link.label}>
                            <Link
                              href={link.href}
                              className="text-sm text-ink/70 transition-colors hover:text-mint-600"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {open.feature && (
                  <Link href={open.feature.href} className="group block min-w-0">
                    <div className="overflow-hidden rounded-2xl bg-shell">
                      <ShopImage
                        image={open.feature.image}
                        sizes="280px"
                        className="aspect-[4/3] w-full transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
                        label={open.feature.title}
                      />
                    </div>
                    <p className="mt-3 font-display text-sm font-bold uppercase tracking-wider2">
                      {open.feature.title}
                    </p>
                    <p className="mt-1 text-xs text-ink/50 transition-colors group-hover:text-mint-600">
                      {open.feature.caption} →
                    </p>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search row — drops under the bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="overflow-hidden border-t border-line bg-shell"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <form
              onSubmit={submitSearch}
              className="mx-auto flex max-w-[90rem] items-center gap-3 px-5 py-4 sm:px-8"
            >
              <SearchIcon className="h-4 w-4 shrink-0 text-ink/40" />
              <input
                autoFocus
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search for a piece, a colour, a collection"
                aria-label="Search the store"
                className="w-full bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
              />
              <button type="submit" className="label hover:text-mint-600">
                Search
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer — slides in from the left */}
      <AnimatePresence>
        {menuOpen && (
          <div className="lg:hidden">
            <motion.div
              className="fixed inset-0 z-[60] bg-ink/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed left-0 top-0 z-[70] flex h-[100dvh] w-[86%] max-w-sm flex-col border-r border-line bg-paper text-ink"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
                <Logo className="h-9" />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-1 text-ink/50 transition-colors hover:text-ink"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-10">
                <nav className="flex flex-col">
                  {items.map((item) => (
                    <MobileItem key={item.label} item={item} />
                  ))}
                </nav>

                <div className="mt-8">
                  <p className="label">Help</p>
                  <div className="mt-4 flex flex-col gap-3">
                    {LEGAL_DOCS.map((doc) => (
                      <Link
                        key={doc.slug}
                        href={`/legal/${doc.slug}`}
                        className="text-sm text-ink/60 transition-colors hover:text-ink"
                      >
                        {doc.nav}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}

/** A drawer row: a plain link, or a collapsible group of links. */
function MobileItem({ item }: { item: NavItem }) {
  const [expanded, setExpanded] = useState(false);
  const hasGroups = Boolean(item.groups?.length);

  if (!hasGroups) {
    return (
      <Link
        href={item.href}
        className={cn(
          'border-b border-line py-4 font-display text-lg font-extrabold uppercase tracking-tight',
          item.accent && 'text-sale',
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between py-4 text-left font-display text-lg font-extrabold uppercase tracking-tight"
      >
        {item.label}
        <ChevronIcon
          className={cn(
            'h-4 w-4 shrink-0 text-ink/40 transition-transform duration-200',
            expanded && 'rotate-180',
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-col gap-5 pb-5">
              {item.groups!.map((group) => (
                <div key={group.heading}>
                  <p className="label">{group.heading}</p>
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {group.links.map((link) => (
                      <li key={link.href + link.label}>
                        <Link href={link.href} className="text-sm text-ink/70">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M3 7h18M3 12h18M3 17h18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function BagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5 8h14l-1 12H6L5 8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
