import Link from 'next/link';
import { ShopImage } from '@/components/shared/shop-image';
import type { Product } from '@/lib/shopify/types';
import { discountPercent, formatPrice } from '@/lib/utils';

/**
 * A grid card: photograph, name, price. Nothing else — the image does the
 * selling, and a uniform 4:5 crop keeps the grid quiet.
 */
export function ProductCard({
  product,
  priority,
}: {
  product: Product;
  priority?: boolean;
}) {
  const discount = discountPercent(
    product.priceRange.minVariantPrice,
    product.compareAtPriceRange?.minVariantPrice,
  );
  const soldOut = !product.availableForSale;

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="relative overflow-hidden bg-shell">
        <ShopImage
          image={product.featuredImage}
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="aspect-[4/5] w-full transition-transform duration-[1200ms] ease-soft group-hover:scale-[1.03]"
          label={product.title}
        />
        {(soldOut || discount) && (
          <span className="absolute left-3 top-3 bg-paper/90 px-2.5 py-1 text-[0.6rem] uppercase tracking-wider2 text-ink">
            {soldOut ? 'Sold out' : `−${discount}%`}
          </span>
        )}
      </div>

      <div className="mt-3.5">
        <h3 className="text-sm leading-snug text-ink transition-opacity group-hover:opacity-60">
          {product.title}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm tabular-nums text-ink/70">
            {formatPrice(product.priceRange.minVariantPrice, { compact: true })}
          </span>
          {discount && product.compareAtPriceRange?.minVariantPrice && (
            <span className="text-xs tabular-nums text-ink/35 line-through">
              {formatPrice(product.compareAtPriceRange.minVariantPrice, { compact: true })}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
