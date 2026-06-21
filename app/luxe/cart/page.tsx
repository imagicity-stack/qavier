'use client';

import Link from 'next/link';
import { useCart } from '@/components/shared/cart-context';
import { ShopImage } from '@/components/shared/shop-image';
import { formatPrice } from '@/lib/utils';

const SHIPPING_FLAT = 100;

export default function LuxeCartPage() {
  const {
    lines,
    totalQuantity,
    subtotal,
    currencyCode,
    updateQuantity,
    removeItem,
  } = useCart();

  const currency = currencyCode || 'INR';
  const total = subtotal + SHIPPING_FLAT;

  return (
    <div className="min-h-screen bg-luxe-cream px-6 pb-24 pt-28 text-luxe-noir sm:px-10 sm:pt-32">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-12">
          <span className="luxe-label">Qavier Luxe</span>
          <h1 className="mt-3 font-serif text-5xl font-light leading-none sm:text-6xl">
            Your Bag{' '}
            <span className="align-middle text-2xl text-luxe-stone sm:text-3xl">
              ({totalQuantity})
            </span>
          </h1>
        </header>

        {lines.length === 0 ? (
          /* ——— Empty state ——— */
          <div className="flex flex-col items-center justify-center gap-8 py-24 text-center">
            <div className="aspect-[3/4] w-40 opacity-70 sm:w-48">
              <ShopImage
                universe="luxe"
                className="h-full w-full"
                label="Your bag awaits"
              />
            </div>
            <div className="space-y-3">
              <p className="font-serif text-3xl font-light italic text-luxe-charcoal sm:text-4xl">
                Your bag is empty
              </p>
              <p className="mx-auto max-w-sm font-sans text-sm leading-relaxed text-luxe-stone">
                Nothing has been added yet. Discover considered pieces made to
                last a lifetime.
              </p>
            </div>
            <Link href="/luxe/shop" className="luxe-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* ——— Items + summary ——— */
          <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
            {/* Items */}
            <section aria-label="Items in your bag">
              <div className="luxe-rule" />
              <ul>
                {lines.map((line) => {
                  const lineTotal = formatPrice({
                    amount: (Number(line.price.amount) * line.quantity).toFixed(2),
                    currencyCode: line.price.currencyCode,
                  });
                  return (
                    <li
                      key={line.variantId}
                      className="flex gap-5 border-b border-luxe-charcoal/15 py-8 sm:gap-7"
                    >
                      <Link
                        href={`/luxe/products/${line.productHandle}`}
                        className="relative h-32 w-24 shrink-0 overflow-hidden"
                        aria-label={`View ${line.productTitle}`}
                      >
                        <ShopImage
                          image={line.image}
                          universe="luxe"
                          className="h-full w-full"
                          sizes="96px"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link
                              href={`/luxe/products/${line.productHandle}`}
                              className="font-serif text-xl leading-tight transition-colors duration-300 hover:text-luxe-gold sm:text-2xl"
                            >
                              {line.productTitle}
                            </Link>
                            <p className="mt-1 font-sans text-xs uppercase tracking-wider2 text-luxe-stone">
                              {line.variantTitle}
                            </p>
                            <p className="mt-2 font-sans text-sm text-luxe-charcoal/70">
                              {formatPrice(line.price)} each
                            </p>
                          </div>
                          <span className="shrink-0 font-serif text-lg sm:text-xl">
                            {lineTotal}
                          </span>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-5">
                          <QtyStepper
                            quantity={line.quantity}
                            title={line.productTitle}
                            onDec={() =>
                              updateQuantity(line.variantId, line.quantity - 1)
                            }
                            onInc={() =>
                              updateQuantity(line.variantId, line.quantity + 1)
                            }
                          />
                          <button
                            type="button"
                            onClick={() => removeItem(line.variantId)}
                            aria-label={`Remove ${line.productTitle} from bag`}
                            className="font-sans text-xs uppercase tracking-wider2 text-luxe-stone underline-offset-4 transition-colors duration-300 hover:text-luxe-noir hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Summary */}
            <aside className="lg:sticky lg:top-32 lg:h-fit">
              <div className="border border-luxe-charcoal/20 bg-luxe-porcelain px-7 py-8">
                <h2 className="luxe-label mb-6">Order Summary</h2>

                <dl className="space-y-4 font-sans text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-luxe-charcoal/80">Subtotal</dt>
                    <dd className="tabular-nums">
                      {formatPrice({ amount: subtotal.toFixed(2), currencyCode: currency })}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-luxe-charcoal/80">Shipping</dt>
                    <dd className="tabular-nums">
                      {formatPrice({ amount: SHIPPING_FLAT.toFixed(2), currencyCode: currency })}
                    </dd>
                  </div>
                </dl>

                <div className="luxe-rule my-6" />

                <div className="flex items-baseline justify-between">
                  <span className="luxe-label !text-luxe-noir">Total</span>
                  <span className="font-serif text-3xl font-light tabular-nums">
                    {formatPrice({ amount: total.toFixed(2), currencyCode: currency })}
                  </span>
                </div>

                <Link href="/luxe/checkout" className="luxe-btn mt-8 w-full">
                  Proceed to Checkout
                </Link>

                <p className="mt-4 text-center font-sans text-[0.68rem] leading-relaxed text-luxe-stone">
                  Taxes &amp; final shipping are confirmed at checkout.
                </p>

                <div className="mt-6 text-center">
                  <Link
                    href="/luxe/shop"
                    className="font-sans text-xs uppercase tracking-wider2 text-luxe-stone underline-offset-4 transition-colors duration-300 hover:text-luxe-noir hover:underline"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function QtyStepper({
  quantity,
  onInc,
  onDec,
  title,
}: {
  quantity: number;
  onInc: () => void;
  onDec: () => void;
  title: string;
}) {
  return (
    <div className="flex items-center border border-luxe-charcoal/25">
      <button
        type="button"
        onClick={onDec}
        aria-label={`Decrease quantity of ${title}`}
        className="grid h-9 w-9 place-items-center text-base text-luxe-charcoal transition-colors duration-300 hover:bg-luxe-noir hover:text-luxe-cream"
      >
        &minus;
      </button>
      <span className="w-10 text-center font-sans text-sm tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onInc}
        aria-label={`Increase quantity of ${title}`}
        className="grid h-9 w-9 place-items-center text-base text-luxe-charcoal transition-colors duration-300 hover:bg-luxe-noir hover:text-luxe-cream"
      >
        +
      </button>
    </div>
  );
}
