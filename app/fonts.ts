import { Manrope, Jost, Space_Grotesk } from 'next/font/google';

/**
 * Typefaces:
 *  • Manrope       → Luxe display (modern minimal sans — clean & contemporary,
 *                    deliberately NOT a serif). Bound to the --font-serif token
 *                    that the Luxe `font-serif` headings use, so swapping it here
 *                    restyles every Luxe heading without touching Pops.
 *  • Jost          → shared humanist sans for body / UI.
 *  • Space Grotesk → Pops display (geometric, chunky, a little weird).
 */
export const serif = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-serif',
  display: 'swap',
});

export const sans = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});
