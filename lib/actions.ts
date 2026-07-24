'use server';

import { createCart, isShopifyConfigured } from './shopify';

export interface CheckoutResult {
  ok: boolean;
  /** Present when Shopify is connected — redirect the browser here. */
  checkoutUrl?: string;
  error?: string;
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
