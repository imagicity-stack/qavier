import Link from 'next/link';
import { ShopImage } from '@/components/shared/shop-image';
import type { Product } from '@/lib/shopify/types';
import { isColorOption, needsSwatchBorder, swatchColor } from '@/lib/swatch';
import { discountPercent, formatPrice } from '@/lib/utils';

const MAX_SWATCHES = 5;

/**
 * A grid card: photograph, flags, name, price, colourways.
 *
 * The second photo fades in on hover where the product has one — the single
 * most useful thing a card can do, because it answers "what does the back
 * look like" without a click. Colour dots come from the product's own `Color`
 * option, so a shopper can see a piece comes in four colours before opening
 * it.
 *
 * The whole card is one link, so everything inside it is non-interactive by
 * design — no nested buttons.
 */
export function ProductCard({
  product,
  priority,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
}) {
  const discount = discountPercent(
    product.priceRange.minVariantPrice,
    product.compareAtPriceRange?.minVariantPrice,
  );
  const soldOut = !product.availableForSale;
  const primary = product.featuredImage;
  // Only use a second photo if it is genuinely a different shot.
  const secondary = product.images.find((img) => img.url && img.url !== primary.url);

  const colors =
    product.options.find((o) => isColorOption(o.name))?.values.filter(Boolean) ?? [];

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-shell">
        <ShopImage
          image={primary}
          priority={priority}
          sizes={sizes}
          className="absolute inset-0 h-full w-full transition-transform duration-[900ms] ease-soft group-hover:scale-[1.04]"
          label={product.title}
        />
        {secondary && (
          <ShopImage
            image={secondary}
            sizes={sizes}
            className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            label={product.title}
          />
        )}

        {/* Flags, stacked top-left */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {soldOut && <span className="badge bg-ink text-paper">Sold out</span>}
          {!soldOut && discount && (
            <span className="badge bg-sale text-paper">−{discount}%</span>
          )}
          {!soldOut && !discount && product.badge && (
            <span className="badge bg-mint-500 text-ink">{product.badge}</span>
          )}
        </div>

        {/* Hover affordance. Decorative — the card itself is the link. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-paper/95 py-2.5 text-center font-display text-[0.65rem] font-bold uppercase tracking-wider2 text-ink opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-sm:hidden"
        >
          {soldOut ? 'View piece' : 'Shop now'}
        </span>
      </div>

      <div className="mt-3.5">
        {product.productType && (
          <p className="text-[0.65rem] uppercase tracking-wider2 text-ink/40">
            {product.productType}
          </p>
        )}
        <h3 className="mt-1 line-clamp-2 text-[0.9rem] font-medium leading-snug text-ink transition-colors group-hover:text-mint-600">
          {product.title}
        </h3>

        <div className="mt-1.5 flex items-baseline gap-2">
          <span
            className={
              discount
                ? 'text-sm font-semibold tabular-nums text-sale'
                : 'text-sm font-semibold tabular-nums text-ink'
            }
          >
            {formatPrice(product.priceRange.minVariantPrice, { compact: true })}
          </span>
          {discount && product.compareAtPriceRange?.minVariantPrice && (
            <span className="text-xs tabular-nums text-ink/40 line-through">
              {formatPrice(product.compareAtPriceRange.minVariantPrice, { compact: true })}
            </span>
          )}
        </div>

        {colors.length > 1 && (
          <div className="mt-2.5 flex items-center gap-1.5">
            {colors.slice(0, MAX_SWATCHES).map((value) => {
              const hex = swatchColor(value);
              return (
                <span
                  key={value}
                  title={value}
                  className={
                    needsSwatchBorder(hex)
                      ? 'h-3 w-3 rounded-full border border-line'
                      : 'h-3 w-3 rounded-full'
                  }
                  style={{ backgroundColor: hex }}
                />
              );
            })}
            {colors.length > MAX_SWATCHES && (
              <span className="text-[0.65rem] tabular-nums text-ink/40">
                +{colors.length - MAX_SWATCHES}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
