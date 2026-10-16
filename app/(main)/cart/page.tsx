'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/shared/cart-context';
import { ShopImage } from '@/components/shared/shop-image';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const {
    lines,
    totalQuantity,
    subtotal,
    currencyCode,
    updateQuantity,
    removeItem,
    refreshPrices,
  } = useCart();

  // Re-read prices from Shopify so the bag never shows a stale snapshot.
  useEffect(() => {
    void refreshPrices();
  }, [refreshPrices]);

  const currency = currencyCode || 'INR';

  if (lines.length === 0) {
    return (
      <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-5 pb-24 pt-16 text-center sm:px-8 sm:pt-24">
        <h1 className="h-page">Your bag is empty</h1>
        <p className="max-w-sm text-[0.95rem] leading-relaxed text-mute">
          Nothing here yet. Have a look at what’s new.
        </p>
        <Link href="/shop" className="btn-dark">
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[70rem] px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
      <header className="mb-10 text-center">
        <h1 className="h-page">
          Your Bag <span className="text-mute">({totalQuantity})</span>
        </h1>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
        <ul className="divide-y divide-line border-y border-line">
          {lines.map((line) => (
            <li key={line.variantId} className="flex gap-5 py-6">
              <Link
                href={`/products/${line.productHandle}`}
                className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden bg-shell"
              >
                <ShopImage
                  image={line.image}
                  sizes="96px"
                  className="absolute inset-0 h-full w-full"
                  label={line.productTitle}
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      href={`/products/${line.productHandle}`}
                      className="h-product text-[1.05rem] hover:underline"
                    >
                      {line.productTitle}
                    </Link>
                    <p className="mt-1 text-[0.8rem] text-mute">{line.variantTitle}</p>
                  </div>
                  <span className="shrink-0 text-sm tabular-nums text-ink/70">
                    {formatPrice({
                      amount: (Number(line.price.amount) * line.quantity).toFixed(2),
                      currencyCode: line.price.currencyCode,
                    })}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center rounded-full border border-line">
                    <button
                      type="button"
                      onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="px-3 py-1.5 text-ink/60 transition-colors hover:text-ink"
                    >
                      −
                    </button>
                    <span className="min-w-[2.25rem] text-center text-sm tabular-nums">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
                      aria-label="Increase quantity"
                      className="px-3 py-1.5 text-ink/60 transition-colors hover:text-ink"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(line.variantId)}
                    className="text-xs text-ink/40 underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="lg:sticky lg:top-32 lg:h-fit">
          <h2 className="font-serif text-[1.4rem]">Order Summary</h2>
          <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
            <span className="text-[0.95rem] font-bold">Subtotal</span>
            <span className="text-[0.95rem] font-bold tabular-nums">
              {formatPrice({ amount: subtotal.toFixed(2), currencyCode: currency })}
            </span>
          </div>
          <p className="mt-2 text-[0.8rem] leading-relaxed text-mute">
            Shipping and taxes calculated at checkout.
          </p>
          <Link href="/checkout" className="btn-dark mt-6 w-full">
            Checkout
          </Link>
          <Link
            href="/shop"
            className="mt-4 block text-center text-[0.85rem] underline underline-offset-4 hover:opacity-60"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </section>
  );
}
