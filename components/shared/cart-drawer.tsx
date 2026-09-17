'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from './cart-context';
import { ShopImage } from './shop-image';
import { formatPrice } from '@/lib/utils';

/** Slide-over bag. Quantities and removal here; the rest at checkout. */
export function CartDrawer() {
  const {
    lines,
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-ink/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your bag"
            className="fixed right-0 top-0 z-[100] flex h-[100dvh] w-full max-w-md flex-col border-l border-line bg-paper"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <span className="label text-ink">Your bag</span>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close bag"
                className="p-1 text-ink/40 transition-colors hover:text-ink"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                  <path
                    d="m6 6 12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
                  <p className="text-sm text-ink/50">Your bag is empty.</p>
                  <Link href="/shop" onClick={closeCart} className="btn-ghost">
                    Browse the collection
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {lines.map((line) => (
                    <li key={line.variantId} className="flex gap-4 py-5">
                      <Link
                        href={`/products/${line.productHandle}`}
                        onClick={closeCart}
                        className="relative h-24 w-20 shrink-0 overflow-hidden bg-shell"
                      >
                        <ShopImage
                          image={line.image}
                          sizes="80px"
                          className="h-full w-full"
                          label={line.productTitle}
                        />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            href={`/products/${line.productHandle}`}
                            onClick={closeCart}
                            className="text-sm leading-snug text-ink transition-opacity hover:opacity-60"
                          >
                            {line.productTitle}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeItem(line.variantId)}
                            aria-label={`Remove ${line.productTitle}`}
                            className="shrink-0 text-xs text-ink/40 underline-offset-4 transition-colors hover:text-ink hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="mt-0.5 text-xs text-ink/45">{line.variantTitle}</p>

                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center border border-line">
                            <button
                              type="button"
                              onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="px-2.5 py-1 text-ink/60 transition-colors hover:text-ink"
                            >
                              −
                            </button>
                            <span className="min-w-[2rem] text-center text-sm tabular-nums">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
                              aria-label="Increase quantity"
                              className="px-2.5 py-1 text-ink/60 transition-colors hover:text-ink"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-sm tabular-nums text-ink/70">
                            {formatPrice({
                              amount: (Number(line.price.amount) * line.quantity).toFixed(2),
                              currencyCode: line.price.currencyCode,
                            })}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-line px-6 py-5">
                {checkoutError && <p className="mb-4 text-xs text-ink/60">{checkoutError}</p>}
                <div className="mb-1 flex items-center justify-between">
                  <span className="label text-ink">Subtotal</span>
                  <span className="text-base tabular-nums text-ink">
                    {formatPrice({ amount: subtotal.toFixed(2), currencyCode })}
                  </span>
                </div>
                <p className="mb-5 text-xs text-ink/45">
                  Shipping and taxes calculated at checkout.
                </p>
                <button
                  type="button"
                  onClick={() => checkout()}
                  disabled={checkingOut}
                  className={`btn w-full ${checkingOut ? 'opacity-60' : ''}`}
                >
                  {checkingOut ? 'One moment…' : 'Checkout'}
                </button>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="mt-3 block text-center text-xs text-ink/50 underline-offset-4 transition-colors hover:text-ink hover:underline"
                >
                  View bag
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
