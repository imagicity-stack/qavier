'use client';

import { useMemo, useState } from 'react';
import { useCart } from '@/components/shared/cart-context';
import { SizeChartDialog } from '@/components/shared/size-chart';
import { Gallery } from '@/components/store/gallery';
import { imageForColor } from '@/components/store/product-card';
import type { Image, Product } from '@/lib/shopify/types';
import { isColorOption, needsSwatchBorder, swatchColor } from '@/lib/swatch';
import { cn, discountPercent, formatPrice, isSizeOption, sortSizes } from '@/lib/utils';

/**
 * The top of the product page: gallery on the left, the purchase panel on the
 * right, sharing one colour selection — picking a colourway swaps the
 * gallery to that colour's shots.
 *
 * Nothing is pre-selected for size: "Add to Bag" asks for one first, so
 * nobody checks out in a size they never chose.
 */
export function ProductView({
  product,
  initialColor,
  children,
}: {
  product: Product;
  initialColor?: string;
  /** Accordions and anything else under the buttons. */
  children?: React.ReactNode;
}) {
  const { addItem } = useCart();

  // Sizes in wearing order, not the order they happen to sit in Shopify.
  const options = useMemo(
    () =>
      product.options.map((o) =>
        isSizeOption(o.name) ? { ...o, values: sortSizes(o.values) } : o,
      ),
    [product.options],
  );
  const colorOption = options.find((o) => isColorOption(o.name));
  const sizeOption = options.find((o) => isSizeOption(o.name));
  const otherOptions = options.filter((o) => o !== colorOption && o !== sizeOption);
  const oneSize = sizeOption?.values.length === 1;

  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const o of options) {
      if (o === sizeOption && !oneSize) continue;
      initial[o.name] =
        o === colorOption && initialColor && o.values.includes(initialColor) ? initialColor : o.values[0];
    }
    return initial;
  });
  const [askSize, setAskSize] = useState(false);

  const color = colorOption ? selected[colorOption.name] : undefined;
  const size = sizeOption ? selected[sizeOption.name] : undefined;

  /** The variant that matches every option chosen so far. */
  const match = (sel: Record<string, string>) =>
    product.variants.find((v) =>
      v.selectedOptions.every((o) => sel[o.name] === undefined || sel[o.name] === o.value),
    );
  const activeVariant = match(selected) ?? product.variants[0];
  const ready = !sizeOption || Boolean(size);
  const soldOut = ready && activeVariant && !activeVariant.availableForSale;
  const discount = discountPercent(activeVariant?.price, activeVariant?.compareAtPrice);

  const isAvailable = (name: string, value: string) =>
    product.variants.some(
      (v) =>
        v.availableForSale &&
        v.selectedOptions.every((o) =>
          o.name === name ? o.value === value : selected[o.name] === undefined || selected[o.name] === o.value,
        ),
    );

  // The gallery shows the chosen colourway's shots, plus any shot that isn't
  // of a particular colour (a detail, a flat lay), when there are any.
  const images = useMemo<Image[]>(() => {
    if (!color || !colorOption) return product.images;
    const mentions = (img: Image, value: string) =>
      Boolean(img.altText?.toLowerCase().includes(value.toLowerCase()));
    const own = product.images.filter((img) => mentions(img, color));
    if (!own.length) return product.images;
    return product.images.filter(
      (img) => own.includes(img) || !colorOption.values.some((v) => mentions(img, v)),
    );
  }, [color, colorOption, product.images]);

  const handleAdd = () => {
    if (!ready) {
      setAskSize(true);
      return;
    }
    if (!activeVariant || soldOut) return;
    addItem({
      variantId: activeVariant.id,
      productHandle: product.handle,
      productTitle: product.title,
      variantTitle: activeVariant.title,
      price: activeVariant.price,
      image: (color && imageForColor(product, color)) || product.featuredImage,
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
      <div className="min-w-0">
        <Gallery images={images} title={product.title} />
      </div>

      <div className="min-w-0 px-4 sm:px-6 lg:sticky lg:top-24 lg:self-start lg:px-0 lg:pr-10 lg:pt-8">
        {product.badge && (
          <span
            className={cn(
              'badge mb-3',
              /best/i.test(product.badge) ? 'bg-accent-soft' : 'bg-accent',
            )}
          >
            {product.badge}
          </span>
        )}
        <h1 className="h-product text-[1.65rem] sm:text-[1.9rem]">{product.title}</h1>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2.5 text-[1rem] tabular-nums">
          <span className={discount ? 'text-sale' : 'text-ink'}>
            {formatPrice(activeVariant?.price)}
          </span>
          {activeVariant?.compareAtPrice && discount && (
            <>
              <span className="text-mute line-through">{formatPrice(activeVariant.compareAtPrice)}</span>
              <span className="text-[0.85rem] font-bold text-sale">Save {discount}%</span>
            </>
          )}
        </div>
        <p className="mt-1 text-[0.8rem] text-mute">Tax included. Shipping calculated at checkout.</p>

        {/* Colour */}
        {colorOption && (
          <div className="mt-7">
            <p className="text-[0.9rem]">
              <span className="font-bold">Color:</span> {color}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {colorOption.values.map((value) => {
                const hex = swatchColor(value);
                const on = value === color;
                return (
                  <button
                    key={value}
                    type="button"
                    title={value}
                    aria-label={value}
                    aria-pressed={on}
                    onClick={() => setSelected((s) => ({ ...s, [colorOption.name]: value }))}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full border transition-colors',
                      on ? 'border-ink' : 'border-transparent hover:border-ink/40',
                    )}
                  >
                    <span
                      className={cn('block h-7 w-7 rounded-full', needsSwatchBorder(hex) && 'border border-line')}
                      style={{ backgroundColor: hex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Size */}
        {sizeOption && !oneSize && (
          <div className="mt-7">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.9rem]">
                <span className="font-bold">Size:</span>{' '}
                {size ?? <span className={askSize ? 'text-sale' : 'text-mute'}>Select a size</span>}
              </p>
              <SizeChartDialog />
            </div>
            <div className="mt-3 grid grid-cols-6 gap-1.5">
              {sizeOption.values.map((value) => {
                const on = value === size;
                const available = isAvailable(sizeOption.name, value);
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setSelected((s) => ({ ...s, [sizeOption.name]: value }));
                      setAskSize(false);
                    }}
                    className={cn(
                      'chip min-w-0 px-1',
                      on ? 'chip-on' : 'chip-off',
                      !available && !on && 'text-mute line-through decoration-1',
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Anything else Shopify defines (Material, Pack, …) */}
        {otherOptions.map((option) => (
          <div key={option.id} className="mt-7">
            <p className="text-[0.9rem]">
              <span className="font-bold">{option.name}:</span> {selected[option.name]}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {option.values.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected[option.name] === value}
                  onClick={() => setSelected((s) => ({ ...s, [option.name]: value }))}
                  className={cn('chip', selected[option.name] === value ? 'chip-on' : 'chip-off')}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAdd}
          disabled={Boolean(soldOut)}
          className={cn('btn-dark mt-7 w-full', soldOut && 'cursor-not-allowed opacity-40')}
        >
          {soldOut ? 'Sold Out' : 'Add to Bag'}
        </button>
        {askSize && (
          <p role="alert" className="mt-2 text-[0.8rem] text-sale">
            Please select a size.
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
