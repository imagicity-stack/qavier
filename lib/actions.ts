'use server';

import { createCart, getVariantPrices, isShopifyConfigured } from './shopify';
import type { Money } from './shopify/types';

export interface CheckoutResult {
  ok: boolean;
  /** Present when Shopify is connected — redirect the browser here. */
  checkoutUrl?: string;
  error?: string;
}

export interface CartPriceUpdate {
  price: Money;
  availableForSale: boolean;
}

/**
 * Re-reads the current Shopify price for each variant in the local bag.
 *
 * The cart persists to localStorage, so a line keeps whatever price it had when
 * it was added — sometimes weeks ago. This lets the cart re-price itself against
 * Shopify on load, so the bag, the checkout summary and the Shopify checkout all
 * agree. Variants missing from the result no longer exist in the store.
 */
export async function refreshCartPrices(
  variantIds: string[],
): Promise<Record<string, CartPriceUpdate>> {
  if (!isShopifyConfigured || !variantIds.length) return {};

  const variants = await getVariantPrices(variantIds);
  return Object.fromEntries(
    Object.entries(variants).map(([id, v]) => [
      id,
      { price: v.price, availableForSale: v.availableForSale },
    ]),
  );
}

/**
 * Turns the client-side cart into a real Shopify checkout and returns the
 * hosted checkout URL. Requires Shopify to be connected.
 */
export async function startCheckout(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<CheckoutResult> {
  if (!isShopifyConfigured) {
    return {
      ok: false,
      error: 'Checkout isn’t available yet — the store is still being connected.',
    };
  }
  try {
    const cart = await createCart(lines);
    return { ok: true, checkoutUrl: cart.checkoutUrl };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Checkout failed. Please try again.',
    };
  }
}
