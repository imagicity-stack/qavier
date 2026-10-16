'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ProductCard } from '@/components/store/product-card';
import type { Product } from '@/lib/shopify/types';
import { isColorOption, needsSwatchBorder, swatchColor } from '@/lib/swatch';
import { cn, isSizeOption, sortSizes } from '@/lib/utils';

type Sort = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'title';

const SORTS: { id: Sort; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'title', label: 'Alphabetical' },
];

/** Price bands, in the store's currency. */
const PRICE_BANDS = [
  { id: 'u1000', label: 'Under ₹1,000', min: 0, max: 999.99 },
  { id: '1000-2000', label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { id: '2000-3000', label: '₹2,000 – ₹3,000', min: 2000.01, max: 3000 },
  { id: 'o3000', label: 'Over ₹3,000', min: 3000.01, max: Infinity },
];

const price = (p: Product) => Number(p.priceRange.minVariantPrice.amount);

const valuesOf = (p: Product, test: (name: string) => boolean) =>
  p.options.find((o) => test(o.name))?.values.filter(Boolean) ?? [];

/**
 * The listing: a toolbar (Filters · item count · Sort by), a filter drawer,
 * and the four-up grid.
 *
 * Every facet is derived from the products actually on the page, so the
 * drawer never offers a filter that would empty the grid — a size nobody
 * stocks simply isn't listed. Used by /shop and every collection page.
 */
export function ShopGrid({
  products,
  initialCategory = 'all',
}: {
  products: Product[];
  initialCategory?: string;
}) {
  const [types, setTypes] = useState<Set<string>>(
    () => new Set(initialCategory === 'all' ? [] : [initialCategory.toLowerCase()]),
  );
  const [sizes, setSizes] = useState<Set<string>>(new Set());
  const [colors, setColors] = useState<Set<string>>(new Set());
  const [bands, setBands] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<Sort>('featured');
  const [drawer, setDrawer] = useState(false);

  const facets = useMemo(() => {
    const typeMap = new Map<string, string>();
    const sizeList: string[] = [];
    const colorMap = new Map<string, string>();
    for (const p of products) {
      const t = p.productType?.trim();
      if (t) typeMap.set(t.toLowerCase(), t);
      for (const s of valuesOf(p, isSizeOption)) if (!sizeList.includes(s)) sizeList.push(s);
      for (const c of valuesOf(p, isColorOption)) colorMap.set(c.toLowerCase(), c);
    }
    return {
      types: [...typeMap.entries()].sort((a, b) => a[1].localeCompare(b[1])),
      sizes: sortSizes(sizeList),
      colors: [...colorMap.entries()].sort((a, b) => a[1].localeCompare(b[1])),
      bands: PRICE_BANDS.filter((b) => products.some((p) => price(p) >= b.min && price(p) <= b.max)),
    };
  }, [products]);

  const shown = useMemo(() => {
    const filtered = products.filter((p) => {
      if (types.size && !types.has((p.productType ?? '').toLowerCase())) return false;
      if (sizes.size && !valuesOf(p, isSizeOption).some((s) => sizes.has(s))) return false;
      if (colors.size && !valuesOf(p, isColorOption).some((c) => colors.has(c.toLowerCase())))
        return false;
      if (bands.size) {
        const amount = price(p);
        const inBand = PRICE_BANDS.some(
          (b) => bands.has(b.id) && amount >= b.min && amount <= b.max,
        );
        if (!inBand) return false;
      }
      return true;
    });

    const sorted = [...filtered];
    switch (sort) {
      case 'newest':
        sorted.sort((a, b) => Number(!a.tags.includes('new')) - Number(!b.tags.includes('new')));
        break;
      case 'price-asc':
        sorted.sort((a, b) => price(a) - price(b));
        break;
      case 'price-desc':
        sorted.sort((a, b) => price(b) - price(a));
        break;
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    return sorted;
  }, [products, types, sizes, colors, bands, sort]);

  const active = types.size + sizes.size + colors.size + bands.size;
  const clearAll = () => {
    setTypes(new Set());
    setSizes(new Set());
    setColors(new Set());
    setBands(new Set());
  };

  return (
    <>
      {/* Toolbar */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-y border-line px-4 py-3 sm:px-6 lg:px-8">
        <div>
          <button type="button" onClick={() => setDrawer(true)} className="btn-box">
            Filters{active > 0 && <span className="font-normal">({active})</span>}
          </button>
        </div>
        <p className="text-center text-[0.85rem] tabular-nums">
          {shown.length} {shown.length === 1 ? 'item' : 'items'}
        </p>
        <div className="flex justify-end">
          <SortMenu value={sort} onChange={setSort} />
        </div>
      </div>

      {/* Grid */}
      {shown.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-10 px-2.5 pb-16 pt-6 sm:px-4 lg:grid-cols-4 lg:gap-y-14 lg:px-6">
          {shown.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="px-4 py-24 text-center">
          <p className="font-serif text-xl">
            {active ? 'Nothing matches those filters.' : 'Nothing here yet.'}
          </p>
          {active > 0 && (
            <button type="button" onClick={clearAll} className="btn-ghost mt-6">
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Filter drawer */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              className="fixed inset-0 z-[80] bg-ink/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              className="fixed left-0 top-0 z-[85] flex h-[100dvh] w-full max-w-[24rem] flex-col bg-paper"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <header className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="font-serif text-[1.4rem]">Filters</h2>
                <button
                  type="button"
                  onClick={() => setDrawer(false)}
                  aria-label="Close filters"
                  className="flex h-9 w-9 items-center justify-center hover:opacity-60"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
                    <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-5">
                {facets.types.length > 1 && (
                  <FilterGroup title="Product Type" count={types.size} defaultOpen>
                    <div className="flex flex-col gap-3">
                      {facets.types.map(([key, label]) => (
                        <Check
                          key={key}
                          label={label}
                          checked={types.has(key)}
                          onChange={() => setTypes(toggle(types, key))}
                        />
                      ))}
                    </div>
                  </FilterGroup>
                )}

                {facets.sizes.length > 1 && (
                  <FilterGroup title="Size" count={sizes.size} defaultOpen>
                    <div className="flex flex-wrap gap-2">
                      {facets.sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          aria-pressed={sizes.has(s)}
                          onClick={() => setSizes(toggle(sizes, s))}
                          className={cn('chip', sizes.has(s) ? 'chip-on' : 'chip-off')}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </FilterGroup>
                )}

                {facets.colors.length > 1 && (
                  <FilterGroup title="Color" count={colors.size} defaultOpen>
                    <div className="grid grid-cols-2 gap-3">
                      {facets.colors.map(([key, label]) => {
                        const hex = swatchColor(label);
                        const on = colors.has(key);
                        return (
                          <button
                            key={key}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setColors(toggle(colors, key))}
                            className="flex items-center gap-2.5 text-left text-[0.85rem]"
                          >
                            <span
                              className={cn(
                                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
                                on ? 'border-ink' : 'border-transparent',
                              )}
                            >
                              <span
                                className={cn(
                                  'block h-[1.1rem] w-[1.1rem] rounded-full',
                                  needsSwatchBorder(hex) && 'border border-line',
                                )}
                                style={{ backgroundColor: hex }}
                              />
                            </span>
                            <span className={on ? 'font-bold' : undefined}>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </FilterGroup>
                )}

                {facets.bands.length > 1 && (
                  <FilterGroup title="Price" count={bands.size}>
                    <div className="flex flex-col gap-3">
                      {facets.bands.map((b) => (
                        <Check
                          key={b.id}
                          label={b.label}
                          checked={bands.has(b.id)}
                          onChange={() => setBands(toggle(bands, b.id))}
                        />
                      ))}
                    </div>
                  </FilterGroup>
                )}
              </div>

              <footer className="grid grid-cols-2 gap-2.5 border-t border-line px-5 py-4">
                <button type="button" onClick={clearAll} className="btn-ghost" disabled={!active}>
                  Clear All
                </button>
                <button type="button" onClick={() => setDrawer(false)} className="btn-dark">
                  View {shown.length} {shown.length === 1 ? 'item' : 'items'}
                </button>
              </footer>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function toggle(set: Set<string>, value: string) {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function FilterGroup({
  title,
  count,
  defaultOpen = false,
  children,
}: {
  title: string;
  count: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="label">
          {title}
          {count > 0 && <span className="ml-1.5 font-normal">({count})</span>}
        </span>
        <span aria-hidden className="text-lg leading-none">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-[0.9rem]">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden
        className={cn(
          'flex h-[1.1rem] w-[1.1rem] items-center justify-center border peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2',
          checked ? 'border-ink bg-ink text-paper' : 'border-ink/40',
        )}
      >
        {checked && (
          <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
            <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}

/** "Sort by: Featured" — a text button opening a small option list. */
function SortMenu({ value, onChange }: { value: Sort; onChange: (s: Sort) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const current = SORTS.find((s) => s.id === value)!;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="py-2 text-[0.85rem]"
      >
        <span className="max-sm:hidden">Sort by: </span>
        <span className="font-bold">{current.label}</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-30 mt-1 w-56 border border-line bg-paper py-2 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.25)]"
        >
          {SORTS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                role="option"
                aria-selected={s.id === value}
                onClick={() => {
                  onChange(s.id);
                  setOpen(false);
                }}
                className={cn(
                  'block w-full px-4 py-2 text-left text-[0.85rem] hover:bg-shell',
                  s.id === value && 'font-bold',
                )}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
