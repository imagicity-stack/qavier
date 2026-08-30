'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useCart } from '@/components/shared/cart-context';
import { SizeChartDialog } from '@/components/qavier/size-chart';
import type { Product } from '@/lib/shopify/types';
import { cn, formatPrice, isSizeOption, sortSizes } from '@/lib/utils';

/** Best-effort name → swatch colour for the demo catalogue. */
const COLOR_HEX: Record<string, string> = {
  Noir: '#1A1A1A',
  Camel: '#C19A6B',
  Ivory: '#F2EBDD',
  Champagne: '#E7D4A6',
  Bordeaux: '#5A1F2B',
  Stone: '#A89F91',
  Charcoal: '#3A3A3D',
  Taupe: '#B7AD9E',
  Sand: '#D8C7A8',
  Onyx: '#0E0E0E',
  Cognac: '#8B4A2F',
};

/**
 * Variant picker + add-to-bag for the Luxe product page (page-based cart).
 * Renders the "Color" option as swatches and other options as pills, then a
 * brief in-place confirmation that links through to the Cart page.
 */
export function LuxePurchase({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);

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

  const handleAdd = () => {
    if (!activeVariant || soldOut) return;
    addItem({
      variantId: activeVariant.id,
      productHandle: product.handle,
      productTitle: product.title,
      variantTitle: activeVariant.title,
      price: activeVariant.price,
      image: product.featuredImage,
      universe: 'luxe',
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-baseline gap-4">
        <span className="font-serif text-3xl text-luxe-noir">
          {formatPrice(activeVariant?.price, { compact: true })}
        </span>
        {/* Compare-at follows the selected variant, not the product-wide range. */}
        {activeVariant?.compareAtPrice && (
          <span className="font-sans text-base text-luxe-stone line-through">
            {formatPrice(activeVariant.compareAtPrice, { compact: true })}
          </span>
        )}
      </div>

      {options.map((option) => {
        const isColor = option.name.toLowerCase() === 'color';
        return (
          <div key={option.id}>
            <div className="mb-3 flex items-center justify-between">
              <span className="luxe-label text-luxe-charcoal">
                {option.name}: <span className="text-luxe-stone">{selected[option.name]}</span>
              </span>
              {!isColor && (
                <SizeChartDialog className="luxe-label text-luxe-stone underline-offset-4 transition-colors duration-300 hover:text-luxe-gold hover:underline" />
              )}
            </div>

            {isColor ? (
              <div className="flex flex-wrap gap-3">
                {option.values.map((value) => {
                  const isActive = selected[option.name] === value;
                  return (
                    <button
                      key={value}
                      onClick={() => setSelected((s) => ({ ...s, [option.name]: value }))}
                      aria-label={value}
                      title={value}
                      className={cn(
                        'h-8 w-8 rounded-full border transition-all',
                        isActive
                          ? 'ring-1 ring-luxe-noir ring-offset-2 ring-offset-luxe-cream'
                          : 'border-luxe-charcoal/20 hover:border-luxe-noir',
                      )}
                      style={{ backgroundColor: COLOR_HEX[value] ?? '#B7AD9E' }}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {option.values.map((value) => {
                  const isActive = selected[option.name] === value;
                  return (
                    <button
                      key={value}
                      onClick={() => setSelected((s) => ({ ...s, [option.name]: value }))}
                      className={cn(
                        'min-w-[3rem] border px-4 py-3 font-sans text-sm transition-all duration-300',
                        isActive
                          ? 'border-luxe-noir bg-luxe-noir text-luxe-cream'
                          : 'border-luxe-charcoal/25 text-luxe-charcoal hover:border-luxe-noir',
                      )}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <div className="flex flex-col gap-3">
        <button
          onClick={handleAdd}
          disabled={soldOut}
          className={cn('luxe-btn w-full', soldOut && 'cursor-not-allowed opacity-40')}
        >
          {soldOut ? 'Sold Out' : 'Add to Bag'}
        </button>
        <button
          onClick={() => setWished((w) => !w)}
          className="luxe-btn-ghost w-full"
          aria-pressed={wished}
        >
          {wished ? '♥ Saved to Wishlist' : '♡ Wishlist'}
        </button>
      </div>

      {added && (
        <div className="flex items-center justify-between border border-luxe-champagne/50 bg-luxe-ivory px-5 py-4">
          <span className="font-sans text-sm text-luxe-charcoal">
            <span className="text-luxe-gold">✦</span> Added to your bag
          </span>
          <Link href="/cart" className="luxe-label text-luxe-noir hover:text-luxe-gold">
            View Bag →
          </Link>
        </div>
      )}
    </div>
  );
}
