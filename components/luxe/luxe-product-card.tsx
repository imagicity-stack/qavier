import Link from 'next/link';
import { ShopImage } from '@/components/shared/shop-image';
import type { Product } from '@/lib/shopify/types';
import { discountPercent, formatPrice } from '@/lib/utils';

export function LuxeProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const discount = discountPercent(
    product.priceRange.minVariantPrice,
    product.compareAtPriceRange?.minVariantPrice,
  );

  // Category (the Shopify product "Type") is the more useful second line;
  // fabric fills in for products that have no type set.
  const subtitle = product.productType || product.material;

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-luxe-ivory">
        <ShopImage
          image={product.featuredImage}
          universe="luxe"
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="h-full w-full transition-transform duration-[1.2s] ease-luxe group-hover:scale-[1.04]"
          label={product.title}
        />
        {product.badge && (
          <span className="absolute left-4 top-4 bg-luxe-noir/90 px-3 py-1 font-sans text-[0.6rem] uppercase tracking-wider2 text-luxe-cream">
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute right-4 top-4 border border-luxe-noir/30 bg-luxe-cream/80 px-3 py-1 font-sans text-[0.6rem] uppercase tracking-wider2 text-luxe-noir">
            −{discount}%
          </span>
        )}
        {/* hover veil + view label */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-luxe-noir/70 to-transparent p-5 text-center opacity-0 transition-all duration-700 ease-luxe group-hover:translate-y-0 group-hover:opacity-100">
          <span className="luxe-label text-luxe-cream">View Piece</span>
        </div>
      </div>

      {/* Meta stacks on mobile so the full title and category fit in a
          half-width card; the title/price row returns from `sm` up. */}
      <div className="mt-3 flex flex-col gap-1 sm:mt-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h3 className="font-serif text-sm leading-snug text-luxe-noir transition-colors group-hover:text-luxe-gold sm:text-base lg:text-lg">
            {product.title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 font-sans text-[0.68rem] leading-snug text-luxe-stone sm:text-xs">
              {subtitle}
            </p>
          )}
        </div>
        <div className="shrink-0 sm:text-right">
          <p className="font-sans text-xs text-luxe-charcoal sm:text-sm">
            {formatPrice(product.priceRange.minVariantPrice, { compact: true })}
          </p>
          {product.compareAtPriceRange?.minVariantPrice && discount && (
            <p className="font-sans text-[0.68rem] text-luxe-stone line-through sm:text-xs">
              {formatPrice(product.compareAtPriceRange.minVariantPrice, { compact: true })}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
