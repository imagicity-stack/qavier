import { Archivo, Inter, Source_Serif_4 } from 'next/font/google';

/**
 * Three faces, each with one job.
 *  • Source Serif 4 → serif: page and section titles, product names, the
 *                     footer's sign-up line. The editorial voice.
 *  • Inter          → sans: navigation, prices, body copy, every control.
 *  • Archivo        → display: small bold caps — column headings, tile
 *                     labels, badges — set wide via its width axis.
 *
 * All are variable fonts, so every weight comes from one file each.
 */
export const serif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const display = Archivo({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['wdth'],
});
