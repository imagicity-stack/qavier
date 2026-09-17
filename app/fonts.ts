import { Manrope, Jost } from 'next/font/google';

/**
 * Two typefaces, no more.
 *  • Manrope → display: the wordmark, headings, anything set in caps.
 *  • Jost    → body and UI.
 */
export const display = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

export const sans = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
});
