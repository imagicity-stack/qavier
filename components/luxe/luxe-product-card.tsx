import Link from 'next/link';
import { ShopImage } from '@/components/shared/shop-image';
import type { Product } from '@/lib/shopify/types';
import { discountPercent, formatPrice } from '@/lib/utils';

export function LuxeProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const discount = discountPercent(
    product.priceRange.minVariantPrice,
    product.compareAtPriceRange?.minVariantPrice,
  );

  return (
    <Link href={`/luxe/products/${product.handle}`} className="group block">
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

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate font-serif text-xl text-luxe-noir transition-colors group-hover:text-luxe-gold">
            {product.title}
          </h3>
          {product.material && (
            <p className="mt-0.5 truncate font-sans text-xs text-luxe-stone">{product.material}</p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="font-sans text-sm text-luxe-charcoal">
            {formatPrice(product.priceRange.minVariantPrice, { compact: true })}
          </p>
          {product.compareAtPriceRange?.minVariantPrice && discount && (
            <p className="font-sans text-xs text-luxe-stone line-through">
              {formatPrice(product.compareAtPriceRange.minVariantPrice, { compact: true })}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
