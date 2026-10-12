import { Archivo, Plus_Jakarta_Sans } from 'next/font/google';

/**
 * Two typefaces, no more.
 *  • Archivo           → display: headings, nav, buttons, anything in caps.
 *  • Plus Jakarta Sans → body and UI.
 *
 * Both are loaded as variable fonts (no `weight` array), so the whole
 * 400–900 range is available from one file each — the heavy, wide caps the
 * brand leans on cost no extra requests.
 */
export const display = Archivo({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
