'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';
import { LuxeProductCard } from '@/components/luxe/luxe-product-card';

// ————————————————————————————————————————————————————————————————
//  Filter definitions
// ————————————————————————————————————————————————————————————————
const CATEGORIES = [
  'Tailoring',
  'Outerwear',
  'Dresses',
  'Knitwear',
  'Eveningwear',
  'Accessories',
] as const;

const SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const;

interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number;
}

const PRICE_RANGES: PriceRange[] = [
  { id: 'under-600', label: 'Under ₹600', min: 0, max: 600 },
  { id: '600-1000', label: '₹600 – ₹1,000', min: 600, max: 1000 },
  { id: '1000-2000', label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { id: '2000-plus', label: '₹2,000+', min: 2000, max: Infinity },
];

// Neutral, on-brand swatch hexes. Anything unmapped falls back to stone.
const COLOR_HEX: Record<string, string> = {
  noir: '#0B0B0C',
  ivory: '#F6F1E7',
  cream: '#FBF8F1',
  stone: '#8A8377',
  taupe: '#B7AD9E',
  camel: '#C19A6B',
  charcoal: '#26262B',
  champagne: '#E4CFA0',
  bordeaux: '#3E1F2B',
  sand: '#DDD0B8',
  onyx: '#1B1B1F',
  cognac: '#8B5A2B',
};

function colorHex(name: string): string {
  return COLOR_HEX[name.toLowerCase()] ?? '#8A8377';
}

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'name-asc', label: 'Name A–Z' },
] as const;

type SortId = (typeof SORTS)[number]['id'];

// ————————————————————————————————————————————————————————————————
//  Product predicates
// ————————————————————————————————————————————————————————————————
function productCategories(product: Product): string[] {
  return product.tags.map((t) => t.toLowerCase());
}

function productSizes(product: Product): string[] {
  const set = new Set<string>();
  for (const v of product.variants) {
    for (const opt of v.selectedOptions) {
      if (opt.name === 'Size') set.add(opt.value);
    }
  }
  return [...set];
}

function productColors(product: Product): string[] {
  const opt = product.options.find((o) => o.name === 'Color');
  return opt ? opt.values : [];
}

// ————————————————————————————————————————————————————————————————
//  Component
// ————————————————————————————————————————————————————————————————
export function LuxeShop({
  products,
  initialCategory,
  initialQuery = '',
}: {
  products: Product[];
  initialCategory: string;
  initialQuery?: string;
}) {
  const normalizedInitial = initialCategory.toLowerCase();
  const validInitial = CATEGORIES.map((c) => c.toLowerCase()).includes(normalizedInitial)
    ? normalizedInitial
    : 'all';

  const [category, setCategory] = useState<string>(validInitial);
  const [query, setQuery] = useState<string>(initialQuery);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [priceId, setPriceId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortId>('featured');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Union of all colours present across the catalogue, for the swatch list.
  const allColors = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) productColors(p).forEach((c) => set.add(c));
    return [...set];
  }, [products]);

  const toggle = (value: string, list: string[], set: (v: string[]) => void) => {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const activeRange = PRICE_RANGES.find((r) => r.id === priceId);
  const trimmedQuery = query.trim().toLowerCase();

  const filtersActive =
    category !== 'all' ||
    sizes.length > 0 ||
    colors.length > 0 ||
    priceId !== null ||
    trimmedQuery !== '';

  const clearAll = () => {
    setCategory('all');
    setQuery('');
    setSizes([]);
    setColors([]);
    setPriceId(null);
  };

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (category !== 'all' && !productCategories(p).includes(category)) return false;

      if (trimmedQuery) {
        const haystack = [
          p.title,
          p.material ?? '',
          p.tagline ?? '',
          p.description,
          ...p.tags,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(trimmedQuery)) return false;
      }

      if (sizes.length) {
        const ps = productSizes(p);
        if (!sizes.some((s) => ps.includes(s))) return false;
      }

      if (colors.length) {
        const pc = productColors(p);
        if (!colors.some((c) => pc.includes(c))) return false;
      }

      if (activeRange) {
        const min = Number(p.priceRange.minVariantPrice.amount);
        if (min < activeRange.min || min >= activeRange.max) return false;
      }

      return true;
    });

    switch (sort) {
      case 'price-asc':
        list = [...list].sort(
          (a, b) =>
            Number(a.priceRange.minVariantPrice.amount) -
            Number(b.priceRange.minVariantPrice.amount),
        );
        break;
      case 'price-desc':
        list = [...list].sort(
          (a, b) =>
            Number(b.priceRange.minVariantPrice.amount) -
            Number(a.priceRange.minVariantPrice.amount),
        );
        break;
      case 'name-asc':
        list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return list;
  }, [products, category, trimmedQuery, sizes, colors, activeRange, sort]);

  // ———————————————————————————————————————————————————————————————
  //  Filter sidebar (shared by desktop column + mobile panel)
  // ———————————————————————————————————————————————————————————————
  const Filters = (
    <div className="space-y-10">
      {/* CATEGORY */}
      <FilterGroup label="Category">
        <ul className="space-y-2.5">
          <li>
            <FilterText
              active={category === 'all'}
              onClick={() => setCategory('all')}
            >
              All
            </FilterText>
          </li>
          {CATEGORIES.map((c) => {
            const slug = c.toLowerCase();
            return (
              <li key={c}>
                <FilterText active={category === slug} onClick={() => setCategory(slug)}>
                  {c}
                </FilterText>
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      {/* SIZE */}
      <FilterGroup label="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => {
            const on = sizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggle(s, sizes, setSizes)}
                aria-pressed={on}
                className={cn(
                  'h-9 min-w-9 px-2 font-sans text-xs uppercase tracking-wider2 transition-colors duration-500 ease-luxe',
                  'border',
                  on
                    ? 'border-luxe-noir bg-luxe-noir text-luxe-cream'
                    : 'border-luxe-charcoal/20 text-luxe-charcoal hover:border-luxe-noir',
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* COLOR */}
      {allColors.length > 0 && (
        <FilterGroup label="Color">
          <div className="flex flex-wrap gap-3">
            {allColors.map((c) => {
              const on = colors.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggle(c, colors, setColors)}
                  title={c}
                  aria-label={c}
                  aria-pressed={on}
                  className={cn(
                    'relative h-7 w-7 rounded-full border transition-transform duration-500 ease-luxe hover:scale-110',
                    on
                      ? 'border-luxe-noir ring-1 ring-luxe-noir ring-offset-2 ring-offset-luxe-cream'
                      : 'border-luxe-charcoal/25',
                  )}
                  style={{ backgroundColor: colorHex(c) }}
                />
              );
            })}
          </div>
        </FilterGroup>
      )}

      {/* PRICE */}
      <FilterGroup label="Price">
        <ul className="space-y-2.5">
          {PRICE_RANGES.map((r) => {
            const on = priceId === r.id;
            return (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => setPriceId(on ? null : r.id)}
                  aria-pressed={on}
                  className="group flex items-center gap-3"
                >
                  <span
                    className={cn(
                      'flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-colors duration-500 ease-luxe',
                      on ? 'border-luxe-noir' : 'border-luxe-charcoal/30',
                    )}
                  >
                    {on && <span className="h-1.5 w-1.5 rounded-full bg-luxe-noir" />}
                  </span>
                  <span
                    className={cn(
                      'font-sans text-sm transition-colors duration-500 ease-luxe',
                      on
                        ? 'text-luxe-noir'
                        : 'text-luxe-charcoal/70 group-hover:text-luxe-noir',
                    )}
                  >
                    {r.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      {filtersActive && (
        <button
          type="button"
          onClick={clearAll}
          className="luxe-label text-luxe-gold underline-offset-4 transition-colors hover:text-luxe-noir hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-28 sm:px-10 sm:pt-32 lg:pb-32">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-luxe-charcoal/10 pb-6">
        <div>
          <p className="luxe-label text-luxe-stone">{trimmedQuery ? 'Search Results' : 'Qavier'}</p>
          <h1 className="mt-3 font-serif text-5xl font-light leading-none text-luxe-noir sm:text-6xl">
            {trimmedQuery ? `“${query.trim()}”` : 'Shop'}
          </h1>
          {trimmedQuery && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="luxe-label mt-3 text-luxe-gold underline-offset-4 transition-colors hover:text-luxe-noir hover:underline"
            >
              Clear search ✕
            </button>
          )}
        </div>
        <label className="flex items-center gap-3">
          <span className="luxe-label text-luxe-stone">Sort By</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortId)}
            aria-label="Sort products"
            className="cursor-pointer border border-luxe-charcoal/20 bg-luxe-cream px-3 py-2 font-sans text-xs uppercase tracking-wider2 text-luxe-noir outline-none transition-colors duration-500 ease-luxe hover:border-luxe-noir focus:border-luxe-noir"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      {/* Mobile filter toggle */}
      <div className="mt-6 flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          className="luxe-btn-ghost !px-6 !py-3"
        >
          Filters{filtersActive ? ' •' : ''}
        </button>
        <span className="luxe-label text-luxe-stone">
          {filtered.length} {filtered.length === 1 ? 'Piece' : 'Pieces'}
        </span>
      </div>

      {/* Mobile collapsible panel */}
      {mobileOpen && (
        <div className="mt-6 border-y border-luxe-charcoal/10 py-8 lg:hidden">{Filters}</div>
      )}

      <div className="mt-10 lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">{Filters}</div>
        </aside>

        {/* Grid */}
        <div>
          <div className="mb-6 hidden items-center justify-between lg:flex">
            <span className="luxe-label text-luxe-stone">
              {filtered.length} {filtered.length === 1 ? 'Piece' : 'Pieces'}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center border border-luxe-charcoal/10 px-6 py-20 text-center">
              <p className="luxe-label text-luxe-stone">Nothing matches</p>
              <p className="mt-4 max-w-sm font-serif text-2xl font-light italic text-luxe-charcoal/70">
                No pieces fit the current selection.
              </p>
              {filtersActive && (
                <button type="button" onClick={clearAll} className="luxe-btn mt-8">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
              {filtered.map((product, i) => (
                <LuxeProductCard key={product.id} product={product} priority={i < 3} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ————————————————————————————————————————————————————————————————
//  Small presentational helpers
// ————————————————————————————————————————————————————————————————
function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="luxe-label mb-4 border-b border-luxe-charcoal/10 pb-3 text-luxe-noir">
        {label}
      </h2>
      {children}
    </div>
  );
}

function FilterText({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'font-sans text-sm transition-colors duration-500 ease-luxe',
        active
          ? 'text-luxe-noir underline decoration-luxe-gold decoration-1 underline-offset-4'
          : 'text-luxe-charcoal/70 hover:text-luxe-noir',
      )}
    >
      {children}
    </button>
  );
}
