'use client';

import { useMemo, useState } from 'react';
import { ProductCard } from '@/components/store/product-card';
import type { Product } from '@/lib/shopify/types';
import { isColorOption, needsSwatchBorder, swatchColor } from '@/lib/swatch';
import { cn } from '@/lib/utils';

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'title';

const SORTS: { id: Sort; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price, low to high' },
  { id: 'price-desc', label: 'Price, high to low' },
  { id: 'title', label: 'A–Z' },
];

const price = (p: Product) => Number(p.priceRange.minVariantPrice.amount);

const colorsOf = (p: Product) =>
  p.options.find((o) => isColorOption(o.name))?.values.filter(Boolean) ?? [];

/**
 * The product grid with its filter bar: category chips, colour swatches, sort.
 *
 * Every facet is derived from the products actually on the page, so the bar
 * never offers a filter that would empty the grid — a category with nothing
 * in it simply isn't shown. Used by both /shop and every collection page.
 */
export function ShopGrid({
  products,
  initialCategory = 'all',
}: {
  products: Product[];
  initialCategory?: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [color, setColor] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>('featured');

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of products) {
      const type = p.productType?.trim();
      if (type) seen.set(type.toLowerCase(), type);
    }
    return [...seen.values()].sort((a, b) => a.localeCompare(b));
  }, [products]);

  const colors = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of products) {
      for (const value of colorsOf(p)) seen.set(value.toLowerCase(), value);
    }
    return [...seen.values()].sort((a, b) => a.localeCompare(b));
  }, [products]);

  const shown = useMemo(() => {
    let filtered = products;

    if (category !== 'all') {
      filtered = filtered.filter(
        (p) => (p.productType ?? '').toLowerCase() === category,
      );
    }
    if (color) {
      filtered = filtered.filter((p) =>
        colorsOf(p).some((v) => v.toLowerCase() === color),
      );
    }

    const sorted = [...filtered];
    switch (sort) {
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
  }, [products, category, color, sort]);

  const filtering = category !== 'all' || color !== null;
  const hasBar = categories.length > 1 || colors.length > 1;

  return (
    <>
      {hasBar && (
        <div className="flex flex-col gap-4 border-b border-line pb-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {categories.length > 1 ? (
              <div className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
                <button
                  type="button"
                  onClick={() => setCategory('all')}
                  className={cn('chip', category === 'all' ? 'chip-on' : 'chip-off')}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c.toLowerCase())}
                    className={cn(
                      'chip',
                      category === c.toLowerCase() ? 'chip-on' : 'chip-off',
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            ) : (
              <span />
            )}

            <label className="flex shrink-0 items-center gap-2">
              <span className="label">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="cursor-pointer rounded-full border border-line bg-paper px-3 py-2 font-display text-[0.65rem] font-bold uppercase tracking-wider2 text-ink focus:border-mint-500 focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {colors.length > 1 && (
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="label mr-1">Colour</span>
              {colors.map((value) => {
                const hex = swatchColor(value);
                const active = color === value.toLowerCase();
                return (
                  <button
                    key={value}
                    type="button"
                    title={value}
                    aria-label={value}
                    aria-pressed={active}
                    onClick={() => setColor(active ? null : value.toLowerCase())}
                    className={cn(
                      'h-7 w-7 rounded-full p-[3px] transition-shadow',
                      active
                        ? 'ring-2 ring-mint-600 ring-offset-1'
                        : 'hover:ring-1 hover:ring-ink/20 hover:ring-offset-1',
                    )}
                  >
                    <span
                      className={cn(
                        'block h-full w-full rounded-full',
                        needsSwatchBorder(hex) && 'border border-line',
                      )}
                      style={{ backgroundColor: hex }}
                    />
                  </button>
                );
              })}
              {color && (
                <button
                  type="button"
                  onClick={() => setColor(null)}
                  className="ml-1 text-[0.65rem] uppercase tracking-wider2 text-ink/45 underline-offset-4 hover:text-ink hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {shown.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-10 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-4">
          {shown.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-sm text-ink/50">
            {filtering
              ? 'Nothing matches those filters.'
              : 'Nothing here yet. New pieces are added as they are made.'}
          </p>
          {filtering && (
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                setColor(null);
              }}
              className="btn-ghost mt-7"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </>
  );
}
