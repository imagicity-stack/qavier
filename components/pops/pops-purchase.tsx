'use client';

import { useMemo, useState } from 'react';
import { useCart } from '@/components/shared/cart-context';
import type { Product } from '@/lib/shopify/types';
import { cn, discountPercent, formatPrice, isSizeOption, sortSizes } from '@/lib/utils';

export function PopsPurchase({ product }: { product: Product }) {
  const { addItem } = useCart();

  // Sizes in wearing order, not the order they happen to sit in Shopify.
  const options = useMemo(
    () =>
      product.options.map((o) =>
        isSizeOption(o.name) ? { ...o, values: sortSizes(o.values) } : o,
      ),
    [product.options],
  );

  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(options.map((o) => [o.name, o.values[0]])),
  );

  const activeVariant = useMemo(
    () =>
      product.variants.find((v) =>
        v.selectedOptions.every((o) => selected[o.name] === o.value),
      ) ?? product.variants[0],
    [product.variants, selected],
  );

  const soldOut = activeVariant && !activeVariant.availableForSale;
  const discount = discountPercent(
    activeVariant?.price,
    activeVariant?.compareAtPrice,
  );

  const handleAdd = () => {
    if (!activeVariant || soldOut) return;
    addItem({
      variantId: activeVariant.id,
      productHandle: product.handle,
      productTitle: product.title,
      variantTitle: activeVariant.title,
      price: activeVariant.price,
      image: product.featuredImage,
      universe: 'pops',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-display text-2xl font-bold text-pops-cream sm:text-3xl lg:text-4xl">
          {formatPrice(activeVariant?.price, { compact: true })}
        </span>
        {activeVariant?.compareAtPrice && (
          <span className="font-display text-xl font-bold text-pops-cream/40 line-through">
            {formatPrice(activeVariant.compareAtPrice, { compact: true })}
          </span>
        )}
        {discount && (
          <span className="rounded-full border-2 border-pops-black bg-pops-magenta px-3 py-1 font-display text-xs font-bold uppercase text-white">
            save {discount}%
          </span>
        )}
      </div>

      {options.map((option) => (
        <div key={option.id}>
          <p className="mb-2 font-display text-sm font-bold uppercase text-pops-cream">
            {option.name}: <span className="text-pops-magenta">{selected[option.name]}</span>
          </p>
          <div className="flex flex-wrap gap-2.5">
            {option.values.map((value) => {
              const isActive = selected[option.name] === value;
              return (
                <button
                  key={value}
                  onClick={() => setSelected((s) => ({ ...s, [option.name]: value }))}
                  className={cn(
                    'rounded-full border-2 border-pops-black px-5 py-2.5 font-display text-sm font-bold uppercase transition-all',
                    isActive
                      ? 'bg-pops-lime text-pops-black'
                      : 'bg-pops-paper text-pops-black hover:bg-pops-yellow',
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <button
        onClick={handleAdd}
        disabled={soldOut}
        className={cn(
          'mt-2 w-full rounded-full border-2 border-pops-black bg-pops-magenta px-7 py-4 font-display text-lg font-bold uppercase text-white shadow-pops transition-transform hover:-translate-y-0.5 hover:shadow-pops-lg active:translate-y-0.5 active:shadow-none',
          soldOut && 'cursor-not-allowed bg-pops-black/30 text-pops-black/50 shadow-none',
        )}
      >
        {soldOut ? 'sold out 😭' : 'add to bag ✦'}
      </button>

      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { t: 'fast shipping', s: 'dispatched quick' },
          { t: 'pod', s: 'print on demand' },
          { t: 'made in india', s: 'start to finish' },
        ].map((b) => (
          <div key={b.t} className="rounded-2xl border-2 border-pops-black bg-pops-cream px-2 py-3">
            <p className="font-display text-xs font-bold uppercase text-pops-black">{b.t}</p>
            <p className="font-sans text-[0.65rem] text-pops-black/60">{b.s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
