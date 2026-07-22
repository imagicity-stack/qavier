'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShopImage } from '@/components/shared/shop-image';
import type { Product } from '@/lib/shopify/types';
import { cn, formatPrice } from '@/lib/utils';

const COLOR_HEX: Record<string, string> = {
  Noir: '#14110F',
  Sand: '#D8C7A6',
  Chocolate: '#4A342A',
  Stone: '#9B958B',
  Forest: '#2F3D34',
  Ivory: '#F2EBDD',
};

function swatch(name: string) {
  return COLOR_HEX[name] ?? '#B7AD9E';
}

/** Home-page product card — image, wishlist heart, title, price and colour swatches. */
export function TeeCard({ product, priority }: { product: Product; priority?: boolean }) {
  const [wished, setWished] = useState(false);
  const colors = product.options.find((o) => o.name === 'Color')?.values ?? [];

  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-md bg-luxe-ivory">
        <Link href={`/products/${product.handle}`} aria-label={product.title} className="block">
          <ShopImage
            image={product.featuredImage}
            universe="luxe"
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="aspect-[4/5] w-full transition-transform duration-700 ease-luxe group-hover:scale-[1.03]"
            label={product.title}
          />
        </Link>

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-luxe-noir/90 px-2.5 py-1 font-sans text-[0.55rem] uppercase tracking-wider2 text-luxe-cream">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => setWished((w) => !w)}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-luxe-cream/90 text-luxe-noir shadow-sm backdrop-blur transition-colors hover:bg-luxe-cream"
        >
          <HeartIcon filled={wished} className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3.5">
        <Link href={`/products/${product.handle}`} className="block">
          <h3 className="font-sans text-[0.78rem] uppercase tracking-wider2 text-luxe-noir transition-colors group-hover:text-luxe-gold">
            {product.title}
          </h3>
        </Link>
        <p className="mt-1.5 font-sans text-sm text-luxe-charcoal">
          {formatPrice(product.priceRange.minVariantPrice, { compact: true })}
        </p>
        {colors.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5">
            {colors.map((c) => (
              <span
                key={c}
                title={c}
                className="h-3.5 w-3.5 rounded-full border border-luxe-charcoal/20"
                style={{ backgroundColor: swatch(c) }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HeartIcon({ filled, className }: { filled?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      className={cn(className, filled && 'text-luxe-gold')}
      aria-hidden
    >
      <path
        d="M12 20s-7-4.3-9.3-8.4C1.3 9 2.3 5.8 5.3 5.1c1.9-.4 3.6.5 4.7 2 1.1-1.5 2.8-2.4 4.7-2 3 .7 4 3.9 2.6 6.5C19 15.7 12 20 12 20Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
