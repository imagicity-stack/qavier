'use client';

import { useMemo, useState } from 'react';
import { useCart } from '@/components/shared/cart-context';
import { SizeChartDialog } from '@/components/shared/size-chart';
import type { Product } from '@/lib/shopify/types';
import { cn, discountPercent, formatPrice, isSizeOption, sortSizes } from '@/lib/utils';

/**
 * Price, options and add-to-bag.
 *
 * "Add to bag" keeps shopping; "Buy it now" goes straight to the Shopify
 * checkout with just this piece.
 */
export function Purchase({ product }: { product: Product }) {
  const { addItem, checkout, checkingOut, checkoutError } = useCart();
  const [buying, setBuying] = useState(false);

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
  const discount = discountPercent(activeVariant?.price, activeVariant?.compareAtPrice);

  const line = () =>
    activeVariant && {
      variantId: activeVariant.id,
      productHandle: product.handle,
      productTitle: product.title,
      variantTitle: activeVariant.title,
      price: activeVariant.price,
      image: product.featuredImage,
    };

  const handleAdd = () => {
    const l = line();
    if (!l || soldOut) return;
    addItem(l);
  };

  const handleBuyNow = async () => {
    const l = line();
    if (!l || soldOut || buying) return;
    setBuying(true);
    addItem(l, 1, { silent: true });
    await checkout([{ merchandiseId: l.variantId, quantity: 1 }]);
    setBuying(false);
  };

  return (
    <div className="flex flex-col gap-7">
      <div>
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-xl tabular-nums text-ink">
            {formatPrice(activeVariant?.price, { compact: true })}
          </span>
          {activeVariant?.compareAtPrice && (
            <span className="text-sm tabular-nums text-ink/35 line-through">
              {formatPrice(activeVariant.compareAtPrice, { compact: true })}
            </span>
          )}
          {discount && (
            <span className="text-[0.65rem] uppercase tracking-wider2 text-ink/50">
              Save {discount}%
            </span>
          )}
        </div>
        <p className="mt-2 text-xs text-ink/45">
          Tax included. Shipping calculated at checkout.
        </p>
      </div>

      {options.map((option) => (
        <div key={option.id}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="label">
              {option.name}:{' '}
              <span className="text-ink">{selected[option.name]}</span>
            </span>
            {isSizeOption(option.name) && <SizeChartDialog />}
          </div>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isActive = selected[option.name] === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelected((s) => ({ ...s, [option.name]: value }))}
                  className={cn(
                    'min-w-[3.25rem] border px-4 py-2.5 text-sm transition-colors duration-200',
                    isActive
                      ? 'border-ink bg-ink text-paper'
                      : 'border-line text-ink hover:border-ink',
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut}
          className={cn('btn-ghost w-full', soldOut && 'cursor-not-allowed opacity-40')}
        >
          {soldOut ? 'Sold out' : 'Add to bag'}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={soldOut || buying || checkingOut}
          className={cn(
            'btn w-full',
            (soldOut || buying || checkingOut) && 'cursor-not-allowed opacity-60',
          )}
        >
          {buying || checkingOut ? 'One moment…' : 'Buy it now'}
        </button>
        {checkoutError && (
          <p className="text-xs text-ink/60">{checkoutError}</p>
        )}
      </div>
    </div>
  );
}
