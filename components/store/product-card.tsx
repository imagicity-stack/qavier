'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShopImage } from '@/components/shared/shop-image';
import type { Image, Product } from '@/lib/shopify/types';
import { isColorOption, needsSwatchBorder, swatchColor } from '@/lib/swatch';
import { cn, discountPercent, formatPrice } from '@/lib/utils';

const MAX_SWATCHES = 5;

/**
 * A grid card: photograph with a promo pill, serif name, price, colourways.
 *
 * The swatches are live — picking one swaps the photo to that colourway where
 * the product has a shot of it, and the card's link follows the choice onto
 * the product page. The second photo fades in on hover, so the back of a
 * piece is one mouse-over away.
 */
export function ProductCard({
  product,
  priority,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  compact = false,
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
  /** Smaller type for the mega-menu and the search panel. */
  compact?: boolean;
}) {
  const colors =
    product.options.find((o) => isColorOption(o.name))?.values.filter(Boolean) ?? [];
  const [color, setColor] = useState<string | null>(null);

  const discount = discountPercent(
    product.priceRange.minVariantPrice,
    product.compareAtPriceRange?.minVariantPrice,
  );
  const soldOut = !product.availableForSale;

  const primary = (color && imageForColor(product, color)) || product.featuredImage;
  // A second, different shot for the hover — the next frame after the primary.
  const primaryIndex = product.images.findIndex((img) => img === primary);
  const secondary = product.images[primaryIndex + 1] ?? undefined;

  const href = `/products/${product.handle}${color ? `?color=${encodeURIComponent(color)}` : ''}`;
  const flag = soldOut
    ? { text: 'Sold out', className: 'bg-ink text-paper' }
    : discount
      ? { text: `${discount}% off`, className: 'bg-sale text-paper' }
      : product.badge
        ? {
            text: product.badge,
            className: /best/i.test(product.badge) ? 'bg-accent-soft text-ink' : 'bg-accent text-ink',
          }
        : null;

  return (
    <div className="group min-w-0">
      <Link href={href} className="relative block aspect-[3/4] overflow-hidden bg-shell">
        <ShopImage
          image={primary}
          priority={priority}
          sizes={sizes}
          className="absolute inset-0 h-full w-full"
          label={product.title}
        />
        {secondary && differs(secondary, primary) && (
          <ShopImage
            image={secondary}
            sizes={sizes}
            className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 max-lg:hidden"
            label={product.title}
          />
        )}
        {flag && (
          <span
            className={cn(
              'badge pointer-events-none absolute',
              compact ? 'left-2 top-3' : 'left-2.5 top-4 sm:left-3 sm:top-5',
              flag.className,
            )}
          >
            {flag.text}
          </span>
        )}
      </Link>

      <div className={compact ? 'mt-3' : 'mt-3 sm:mt-4'}>
        <Link href={href} className="block">
          <h3
            className={cn(
              'h-product line-clamp-2 hover:underline',
              compact ? 'text-[0.95rem]' : 'text-[0.95rem] sm:text-[1.05rem]',
            )}
          >
            {product.title}
          </h3>
        </Link>

        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[0.85rem] tabular-nums">
          <span className={discount ? 'text-sale' : 'text-ink'}>
            {formatPrice(product.priceRange.minVariantPrice)}
          </span>
          {discount && product.compareAtPriceRange?.minVariantPrice && (
            <>
              <span className="text-mute line-through">
                {formatPrice(product.compareAtPriceRange.minVariantPrice)}
              </span>
              {/* The red price already says it; the word only fits on wide cards. */}
              {!compact && <span className="font-bold text-sale max-sm:hidden">Sale</span>}
            </>
          )}
        </div>

        {colors.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5">
            {colors.slice(0, MAX_SWATCHES).map((value, i) => {
              const hex = swatchColor(value);
              const active = color ? color === value : i === 0;
              return (
                <button
                  key={value}
                  type="button"
                  title={value}
                  aria-label={`${product.title} in ${value}`}
                  aria-pressed={active}
                  onClick={() => setColor(value)}
                  className={cn(
                    'flex h-[1.4rem] w-[1.4rem] items-center justify-center rounded-full border transition-colors',
                    active ? 'border-ink' : 'border-transparent hover:border-ink/40',
                  )}
                >
                  <span
                    className={cn(
                      'block h-[1rem] w-[1rem] rounded-full',
                      needsSwatchBorder(hex) && 'border border-line',
                    )}
                    style={{ backgroundColor: hex }}
                  />
                </button>
              );
            })}
            {colors.length > MAX_SWATCHES && (
              <span className="ml-0.5 text-[0.8rem] tabular-nums text-ink">
                +{colors.length - MAX_SWATCHES}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * The first photo of a colourway — matched on alt text, which is how both the
 * demo catalogue and most Shopify stores label their shots ("… in Navy").
 */
export function imageForColor(product: Product, color: string): Image | undefined {
  const needle = color.toLowerCase();
  return product.images.find((img) => img.altText?.toLowerCase().includes(needle));
}

/** Whether two image slots show different things. */
function differs(a: Image, b: Image) {
  if (a.url || b.url) return a.url !== b.url;
  return a.art?.view !== b.art?.view || a.art?.color !== b.art?.color;
}
