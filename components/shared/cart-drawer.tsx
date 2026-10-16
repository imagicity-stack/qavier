'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from './cart-context';
import { ShopImage } from './shop-image';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';
import { formatPrice } from '@/lib/utils';

/**
 * Slide-over bag: a free-shipping meter, the lines with quantity steppers,
 * and the subtotal with the way to checkout.
 *
 * The meter reads the same threshold as the announcement bar and the
 * checkout, so the three can't disagree about what ships free.
 */
export function CartDrawer() {
  const {
    lines,
    totalQuantity,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    currencyCode,
    checkout,
    checkingOut,
    checkoutError,
  } = useCart();

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your bag"
            className="fixed right-0 top-0 z-[100] flex h-[100dvh] w-full max-w-[28rem] flex-col bg-paper"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
              <h2 className="font-serif text-[1.4rem]">
                Your Bag{totalQuantity > 0 && <span className="text-mute"> ({totalQuantity})</span>}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close bag"
                className="flex h-9 w-9 items-center justify-center transition-opacity hover:opacity-60"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
                  <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            {lines.length > 0 && (
              <div className="border-b border-line px-5 py-4 sm:px-6">
                <p className="text-[0.85rem]">
                  {remaining > 0 ? (
                    <>
                      You’re{' '}
                      <strong>{formatPrice({ amount: remaining.toFixed(2), currencyCode })}</strong>{' '}
                      away from free shipping.
                    </>
                  ) : (
                    <>
                      You’ve unlocked <strong>free shipping</strong>.
                    </>
                  )}
                </p>
                <div className="mt-2.5 h-1 w-full bg-line">
                  <div
                    className="h-full bg-ink transition-[width] duration-500 ease-soft"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-5 sm:px-6">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
                  <p className="font-serif text-xl">Your bag is empty</p>
                  <div className="flex flex-col gap-2.5">
                    <Link href="/collections/new-arrivals" onClick={closeCart} className="btn-dark">
                      Shop New Arrivals
                    </Link>
                    <Link href="/shop" onClick={closeCart} className="btn-ghost">
                      Shop All
                    </Link>
                  </div>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {lines.map((line) => (
                    <li key={line.variantId} className="flex gap-4 py-5">
                      <Link
                        href={`/products/${line.productHandle}`}
                        onClick={closeCart}
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
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            href={`/products/${line.productHandle}`}
                            onClick={closeCart}
                            className="h-product text-[1rem] hover:underline"
                          >
                            {line.productTitle}
                          </Link>
                          <span className="shrink-0 text-[0.85rem] tabular-nums">
                            {formatPrice({
                              amount: (Number(line.price.amount) * line.quantity).toFixed(2),
                              currencyCode: line.price.currencyCode,
                            })}
                          </span>
                        </div>
                        <p className="mt-1 text-[0.8rem] text-mute">{line.variantTitle}</p>

                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center rounded-full border border-line">
                            <button
                              type="button"
                              onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="h-8 w-8 text-ink/70 transition-colors hover:text-ink"
                            >
                              −
                            </button>
                            <span className="min-w-[1.5rem] text-center text-[0.85rem] tabular-nums">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
                              aria-label="Increase quantity"
                              className="h-8 w-8 text-ink/70 transition-colors hover:text-ink"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(line.variantId)}
                            aria-label={`Remove ${line.productTitle}`}
                            className="text-[0.8rem] underline underline-offset-4 hover:opacity-60"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-line px-5 py-5 sm:px-6">
                {checkoutError && <p className="mb-4 text-[0.8rem] text-sale">{checkoutError}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-[0.95rem] font-bold">Subtotal</span>
                  <span className="text-[0.95rem] font-bold tabular-nums">
                    {formatPrice({ amount: subtotal.toFixed(2), currencyCode })}
                  </span>
                </div>
                <p className="mt-1 text-[0.8rem] text-mute">
                  Shipping and taxes calculated at checkout.
                </p>
                <button
                  type="button"
                  onClick={() => checkout()}
                  disabled={checkingOut}
                  className={`btn-dark mt-4 w-full ${checkingOut ? 'opacity-60' : ''}`}
                >
                  {checkingOut ? 'One moment…' : 'Checkout'}
                </button>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="mt-3 block text-center text-[0.85rem] underline underline-offset-4 hover:opacity-60"
                >
                  View Bag
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
