'use client';

import { useMemo, useState } from 'react';
import { ProductCard } from '@/components/store/product-card';
import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'title';

const SORTS: { id: Sort; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price, low to high' },
  { id: 'price-desc', label: 'Price, high to low' },
  { id: 'title', label: 'A–Z' },
];

const price = (p: Product) => Number(p.priceRange.minVariantPrice.amount);

/**
 * The collection grid: category row, sort, products.
 *
 * Categories come from the Shopify product Type actually present in the
 * catalogue, so the filter row never offers an empty rail.
 */
export function ShopGrid({
  products,
  initialCategory = 'all',
}: {
  products: Product[];
  initialCategory?: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<Sort>('featured');

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of products) {
      const type = p.productType?.trim();
      if (type) seen.set(type.toLowerCase(), type);
    }
    return [...seen.values()].sort((a, b) => a.localeCompare(b));
  }, [products]);

  const shown = useMemo(() => {
    const filtered =
      category === 'all'
        ? products
        : products.filter((p) => (p.productType ?? '').toLowerCase() === category);

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
  }, [products, category, sort]);

  return (
    <>
      {(categories.length > 0 || products.length > 0) && (
        <div className="flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="scrollbar-none -mx-5 flex gap-6 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <FilterButton
              active={category === 'all'}
              onClick={() => setCategory('all')}
              label="All"
            />
            {categories.map((c) => (
              <FilterButton
                key={c}
                active={category === c.toLowerCase()}
                onClick={() => setCategory(c.toLowerCase())}
                label={c}
              />
            ))}
          </div>

          <label className="flex shrink-0 items-center gap-2 text-[0.65rem] uppercase tracking-wider2 text-ink/50">
            <span className="sr-only sm:not-sr-only">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="cursor-pointer bg-transparent pr-1 text-[0.65rem] uppercase tracking-wider2 text-ink focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {shown.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
          {shown.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-sm text-ink/45">
          Nothing here yet. New pieces are added as they are made.
        </p>
      )}
    </>
  );
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'shrink-0 whitespace-nowrap pb-1 text-[0.65rem] uppercase tracking-wider2 transition-colors',
        active ? 'border-b border-ink text-ink' : 'text-ink/45 hover:text-ink',
      )}
    >
      {label}
    </button>
  );
}
