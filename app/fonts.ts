import { Cormorant_Garamond, Jost, Space_Grotesk } from 'next/font/google';

/**
 * Three typefaces, two moods:
 *  • Cormorant Garamond → Luxe display serif (editorial, high-contrast).
 *  • Jost              → shared humanist sans for body / UI.
 *  • Space Grotesk      → Pops display (geometric, chunky, a little weird).
 */
export const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
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
