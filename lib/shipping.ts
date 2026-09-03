/**
 * Shipping options — the single source of truth.
 *
 * Used by the checkout (what a shopper is charged) and by the shipping policy
 * page (what we tell them). Keeping one copy means the page and the till can't
 * quote different numbers.
 */
export interface ShippingMethod {
  id: string;
  label: string;
  detail: string;
  /** Charge in the store's currency. */
  cost: number;
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  { id: 'standard', label: 'Standard', detail: '5–7 business days', cost: 100 },
  { id: 'express', label: 'Express', detail: '2–4 business days', cost: 250 },
];

/** Order value at or above which standard shipping is free. */
export const FREE_SHIPPING_THRESHOLD = 2000;

/** Working days between payment and hand-off to the courier. */
export const DISPATCH_DAYS = '1–2 business days';

/** Days a shopper has to start a return, from delivery. */
export const RETURN_WINDOW_DAYS = 30;

/** Working days for a refund to reach the original payment method. */
export const REFUND_DAYS = '5–7 business days';
