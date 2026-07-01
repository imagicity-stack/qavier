'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from './cart-context';
import { ShopImage } from './shop-image';
import type { Universe } from '@/lib/shopify/types';
import { cn, formatPrice } from '@/lib/utils';

/**
 * Slide-over cart, themed per universe. The same cart data renders in either
 * skin; only the chrome changes.
 */
export function CartDrawer({ universe }: { universe: Universe }) {
  const {
    lines,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    currencyCode,
    totalQuantity,
    checkout,
    checkingOut,
    isDemo,
  } = useCart();

  const luxe = universe === 'luxe';
  const shopHref = luxe ? '/collection' : '/pops/shop';
  // Qavier (formerly "luxe") lives at the site root; Pops is nested under /pops.
  const productBase = luxe ? '/products' : '/pops/products';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className={cn(
              'fixed right-0 top-0 z-[100] flex h-[100dvh] w-full max-w-md flex-col',
              luxe
                ? 'bg-luxe-cream text-luxe-noir'
                : 'border-l-2 border-pops-black bg-pops-paper text-pops-black',
            )}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Shopping bag"
          >
            {/* Header */}
            <div
              className={cn(
                'flex items-center justify-between px-6 py-5',
                luxe ? 'border-b border-luxe-charcoal/15' : 'border-b-2 border-pops-black',
              )}
            >
              <h2
                className={cn(
                  luxe
                    ? 'font-serif text-2xl'
                    : 'font-display text-2xl font-bold uppercase',
                )}
              >
                {luxe ? 'Your Selection' : 'Your Bag'}{' '}
                <span className={luxe ? 'text-luxe-stone' : 'text-pops-magenta'}>
                  ({totalQuantity})
                </span>
              </h2>
              <button
                onClick={closeCart}
                aria-label="Close bag"
                className={cn(
                  'grid h-9 w-9 place-items-center transition',
                  luxe
                    ? 'hover:text-luxe-gold'
                    : 'rounded-full border-2 border-pops-black hover:bg-pops-yellow',
                )}
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Lines */}
            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-none">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
                  <p
                    className={cn(
                      luxe
                        ? 'font-serif text-2xl italic text-luxe-stone'
                        : 'font-display text-xl font-bold uppercase',
                    )}
                  >
                    {luxe ? 'Your selection is empty' : 'nothing here yet 🫠'}
                  </p>
                  <Link
                    href={shopHref}
                    onClick={closeCart}
                    className={luxe ? 'luxe-btn' : 'pops-btn'}
                  >
                    {luxe ? 'Explore the Collection' : 'start shopping'}
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-5">
                  {lines.map((line) => (
                    <li key={line.variantId} className="flex gap-4">
                      <div
                        className={cn(
                          'relative h-28 w-20 shrink-0 overflow-hidden',
                          luxe ? '' : 'rounded-2xl border-2 border-pops-black',
                        )}
                      >
                        <ShopImage
                          image={line.image}
                          universe={universe}
                          className="h-full w-full"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`${productBase}/${line.productHandle}`}
                            onClick={closeCart}
                            className={cn(
                              'leading-tight',
                              luxe
                                ? 'font-serif text-lg hover:text-luxe-gold'
                                : 'font-display text-sm font-bold uppercase hover:text-pops-magenta',
                            )}
                          >
                            {line.productTitle}
                          </Link>
                          <button
                            onClick={() => removeItem(line.variantId)}
                            aria-label="Remove item"
                            className={cn(
                              'shrink-0 text-xs underline-offset-4 hover:underline',
                              luxe ? 'text-luxe-stone' : 'text-pops-black/60',
                            )}
                          >
                            Remove
                          </button>
                        </div>
                        <p
                          className={cn(
                            'mt-0.5 text-xs',
                            luxe ? 'text-luxe-stone' : 'text-pops-black/60',
                          )}
                        >
                          {line.variantTitle}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <QtyStepper
                            luxe={luxe}
                            quantity={line.quantity}
                            onDec={() => updateQuantity(line.variantId, line.quantity - 1)}
                            onInc={() => updateQuantity(line.variantId, line.quantity + 1)}
                          />
                          <span
                            className={cn(
                              luxe ? 'font-sans text-sm' : 'font-display text-sm font-bold',
                            )}
                          >
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

            {/* Footer */}
            {lines.length > 0 && (
              <div
                className={cn(
                  'px-6 py-5',
                  luxe ? 'border-t border-luxe-charcoal/15' : 'border-t-2 border-pops-black',
                )}
              >
                {isDemo && (
                  <div
                    className={cn(
                      'mb-4 px-4 py-3 text-xs',
                      luxe
                        ? 'border border-luxe-champagne/50 bg-luxe-ivory text-luxe-charcoal'
                        : 'rounded-2xl border-2 border-pops-black bg-pops-yellow text-pops-black',
                    )}
                  >
                    <strong>Preview mode.</strong> Connect your Shopify store
                    (SHOPIFY_* env vars) to enable real checkout. Your bag is saved locally.
                  </div>
                )}
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={cn(
                      luxe
                        ? 'luxe-label'
                        : 'font-display text-sm font-bold uppercase',
                    )}
                  >
                    Subtotal
                  </span>
                  <span
                    className={cn(
                      luxe ? 'font-serif text-2xl' : 'font-display text-2xl font-bold',
                    )}
                  >
                    {formatPrice({ amount: subtotal.toFixed(2), currencyCode })}
                  </span>
                </div>
                <button
                  onClick={checkout}
                  disabled={checkingOut}
                  className={cn(
                    'w-full',
                    luxe ? 'luxe-btn' : 'pops-btn !bg-pops-magenta !text-white',
                    checkingOut && 'opacity-60',
                  )}
                >
                  {checkingOut
                    ? 'One moment…'
                    : luxe
                      ? 'Proceed to Checkout'
                      : 'checkout now ✦'}
                </button>
                <p
                  className={cn(
                    'mt-3 text-center text-[0.68rem]',
                    luxe ? 'text-luxe-stone' : 'text-pops-black/50',
                  )}
                >
                  Taxes &amp; shipping calculated at checkout
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function QtyStepper({
  quantity,
  onInc,
  onDec,
  luxe,
}: {
  quantity: number;
  onInc: () => void;
  onDec: () => void;
  luxe: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center',
        luxe
          ? 'border border-luxe-charcoal/20'
          : 'rounded-full border-2 border-pops-black',
      )}
    >
      <button
        onClick={onDec}
        aria-label="Decrease quantity"
        className={cn('grid h-7 w-7 place-items-center text-sm', !luxe && 'hover:bg-pops-lime')}
      >
        –
      </button>
      <span className="w-7 text-center text-sm tabular-nums">{quantity}</span>
      <button
        onClick={onInc}
        aria-label="Increase quantity"
        className={cn('grid h-7 w-7 place-items-center text-sm', !luxe && 'hover:bg-pops-lime')}
      >
        +
      </button>
    </div>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
