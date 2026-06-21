import { Newsreader, Jost, Space_Grotesk } from 'next/font/google';

/**
 * Three typefaces, two moods:
 *  • Newsreader    → Luxe display serif (clean, modern editorial — low contrast,
 *                    less ornate than a high-fashion didone).
 *  • Jost          → shared humanist sans for body / UI.
 *  • Space Grotesk → Pops display (geometric, chunky, a little weird).
 */
export const serif = Newsreader({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
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
