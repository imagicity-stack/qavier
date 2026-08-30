import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Money } from './shopify/types';

/** Tailwind-aware className combiner. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a Shopify Money object as a localized currency string. */
export function formatPrice(money?: Money | null, opts?: { compact?: boolean }) {
  if (!money) return '';
  const amount = Number(money.amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode || 'INR',
    minimumFractionDigits: opts?.compact && Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Build a deterministic gradient seed from a string (for placeholder art). */
export function seededHue(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
}

/** Percentage saved between two money values, or null. */
export function discountPercent(price?: Money | null, compareAt?: Money | null) {
  if (!price || !compareAt) return null;
  const p = Number(price.amount);
  const c = Number(compareAt.amount);
  if (!c || c <= p) return null;
  return Math.round(((c - p) / c) * 100);
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Size values in wearing order, whatever order Shopify hands them over in.
 *
 * Shopify lists option values in whatever order they were typed, so a product
 * can show "2XL, XL, L, XS, M, S" — nobody scans that. Letter sizes are put on
 * the standard ladder and pure numbers sort numerically.
 *
 * Only reorders when EVERY value is recognised: a store using its own scheme
 * ("one size", "kids 4-5") keeps the order it chose, rather than being shuffled
 * into something arbitrary.
 */
const SIZE_LADDER: Record<string, number> = {
  xxxs: 0, xxs: 1, xs: 2, s: 3, small: 3, m: 4, medium: 4, l: 5, large: 5,
  xl: 6, xxl: 7, '2xl': 7, xxxl: 8, '3xl': 8, xxxxl: 9, '4xl': 9, '5xl': 10,
};

export function sortSizes(values: string[]): string[] {
  const key = (v: string) => v.toLowerCase().replace(/[\s._-]/g, '');

  const ranks = values.map((v) => SIZE_LADDER[key(v)]);
  if (ranks.every((r) => r !== undefined)) {
    return values
      .map((v, i) => ({ v, r: ranks[i] as number }))
      .sort((a, b) => a.r - b.r)
      .map((x) => x.v);
  }

  const numbers = values.map((v) => Number(key(v)));
  if (numbers.every((n) => Number.isFinite(n))) {
    return values
      .map((v, i) => ({ v, n: numbers[i] }))
      .sort((a, b) => a.n - b.n)
      .map((x) => x.v);
  }

  return values;
}

/** True for an option that names a garment size, in any casing. */
export function isSizeOption(name: string): boolean {
  return name.trim().toLowerCase() === 'size';
}

/**
 * The frame shape for a product gallery, taken from the store's own photography.
 *
 * Forcing every photo into one fixed ratio and cropping to fill is what makes a
 * product page look zoomed in — a square or landscape shot loses its edges in a
 * portrait frame. Sizing the frame to the first image instead means the common
 * case (a store whose shots are all one shape) shows the whole garment with no
 * crop and no letterboxing.
 *
 * Clamped so an unusually wide or tall photo can't distort the page, and falls
 * back to the universe's default when Shopify didn't report dimensions.
 */
export function galleryAspectRatio(
  image: { width?: number; height?: number } | undefined | null,
  fallback: number,
): number {
  const { width, height } = image ?? {};
  if (!width || !height) return fallback;
  const ratio = width / height;
  if (!Number.isFinite(ratio) || ratio <= 0) return fallback;
  // Range covers the shapes stores actually shoot — 2:3 portrait through 4:3
  // landscape — so those fit the frame exactly, with no bars and no crop.
  return Math.min(Math.max(ratio, 0.62), 1.34);
}
