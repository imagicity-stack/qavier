'use server';

import { createCart, isShopifyConfigured } from './shopify';

export interface CheckoutResult {
  ok: boolean;
  /** Present when Shopify is connected — redirect the browser here. */
  checkoutUrl?: string;
  /** True when running on demo data (no real checkout available). */
  demo?: boolean;
  error?: string;
}

/**
 * Turns the client-side cart into a real Shopify checkout.
 *
 * In demo mode (no Shopify creds) this returns `{ demo: true }` so the UI can
 * show a friendly "this is a preview" message instead of a broken redirect.
 */
export async function startCheckout(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<CheckoutResult> {
  if (!isShopifyConfigured) {
    return { ok: true, demo: true };
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
