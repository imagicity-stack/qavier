'use client';

import { useMemo, useState } from 'react';
import { useCart } from '@/components/shared/cart-context';
import type { Product } from '@/lib/shopify/types';
import { cn, formatPrice } from '@/lib/utils';

/**
 * Variant picker + add-to-bag for the Luxe product page.
 * Resolves the matching variant from the selected options.
 */
export function LuxePurchase({ product }: { product: Product }) {
  const { addItem } = useCart();

  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.options.map((o) => [o.name, o.values[0]])),
  );

  const activeVariant = useMemo(() => {
    return (
      product.variants.find((v) =>
        v.selectedOptions.every((o) => selected[o.name] === o.value),
      ) ?? product.variants[0]
    );
  }, [product.variants, selected]);

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
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-baseline gap-4">
        <span className="font-serif text-3xl text-luxe-noir">
          {formatPrice(activeVariant?.price, { compact: true })}
        </span>
        {product.compareAtPriceRange?.minVariantPrice && (
          <span className="font-sans text-base text-luxe-stone line-through">
            {formatPrice(product.compareAtPriceRange.minVariantPrice, { compact: true })}
          </span>
        )}
      </div>

      {product.options.map((option) => (
        <div key={option.id}>
          <div className="mb-3 flex items-center justify-between">
            <span className="luxe-label text-luxe-charcoal">{option.name}</span>
            <span className="font-sans text-sm text-luxe-stone">{selected[option.name]}</span>
          </div>
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
        </div>
      ))}

      <button
        onClick={handleAdd}
        disabled={soldOut}
        className={cn('luxe-btn w-full', soldOut && 'cursor-not-allowed opacity-40')}
      >
        {soldOut ? 'Sold Out' : 'Add to Bag'}
      </button>

      <ul className="flex flex-col gap-3 border-t border-luxe-charcoal/10 pt-6">
        {[
          'Complimentary insured delivery',
          'Returns within 30 days',
          'Includes Qavier authenticity seal',
        ].map((item) => (
          <li key={item} className="flex items-center gap-3 font-sans text-sm text-luxe-charcoal">
            <span className="text-luxe-gold">✦</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
