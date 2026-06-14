import Link from 'next/link';
import { ShopImage } from '@/components/shared/shop-image';
import type { Product } from '@/lib/shopify/types';
import { cn, discountPercent, formatPrice } from '@/lib/utils';

const ACCENTS = [
  'bg-pops-lime',
  'bg-pops-cyan',
  'bg-pops-pink',
  'bg-pops-yellow',
  'bg-pops-violet',
  'bg-pops-orange',
];

export function PopsProductCard({
  product,
  index = 0,
  priority,
}: {
  product: Product;
  index?: number;
  priority?: boolean;
}) {
  const accent = ACCENTS[index % ACCENTS.length];
  const discount = discountPercent(
    product.priceRange.minVariantPrice,
    product.compareAtPriceRange?.minVariantPrice,
  );

  return (
    <Link
      href={`/pops/products/${product.handle}`}
      className="group relative block rounded-pops border-2 border-pops-black bg-pops-paper shadow-pops transition-transform duration-200 hover:-translate-y-1.5 hover:shadow-pops-lg"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[1.55rem]">
        <ShopImage
          image={product.featuredImage}
          universe="pops"
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
          label={product.title}
        />
        {/* sticker badge */}
        {product.badge && (
          <span
            className={cn(
              'absolute left-3 top-3 -rotate-3 rounded-full border-2 border-pops-black px-3 py-1 font-display text-xs font-bold uppercase text-pops-black shadow-pops',
              accent,
            )}
          >
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute right-3 top-3 rotate-3 rounded-full border-2 border-pops-black bg-pops-magenta px-3 py-1 font-display text-xs font-bold uppercase text-white shadow-pops">
            −{discount}%
          </span>
        )}
      </div>

      <div className="border-t-2 border-pops-black p-4">
        <h3 className="font-display text-lg font-bold uppercase leading-tight text-pops-black">
          {product.title}
        </h3>
        {product.tagline && (
          <p className="mt-1 line-clamp-1 font-sans text-xs text-pops-black/60">{product.tagline}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold text-pops-black">
              {formatPrice(product.priceRange.minVariantPrice, { compact: true })}
            </span>
            {discount && product.compareAtPriceRange?.minVariantPrice && (
              <span className="font-sans text-xs text-pops-black/40 line-through">
                {formatPrice(product.compareAtPriceRange.minVariantPrice, { compact: true })}
              </span>
            )}
          </div>
          <span
            className={cn(
              'grid h-9 w-9 place-items-center rounded-full border-2 border-pops-black transition-transform group-hover:rotate-90',
              accent,
            )}
            aria-hidden
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M12 5v14M5 12h14" stroke="#0E0E12" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
