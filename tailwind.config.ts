import type { Config } from 'tailwindcss';

/**
 * The Qavier palette.
 *
 * Mint green is the brand: it carries the announcement bar, the primary
 * button, badges, swatch rings and every hover state. Type sits in a deep
 * forest ink rather than black, so the dark end of the page belongs to the
 * same family as the accent instead of fighting it.
 *
 * `sale` is the one colour outside the family — a markdown has to read as a
 * markdown at a glance, and a mint price tag next to a mint button says
 * nothing. Use it for struck prices and sale badges only.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /** Deep forest — body copy, headings, the dark end of the page. */
        ink: '#0C231B',
        paper: '#FFFFFF',
        /** Pale mint wash, for bands that need to lift off paper. */
        shell: '#F1F8F4',
        /** The hairline, tinted so it belongs to the palette. */
        line: '#DCE8E1',
        mint: {
          50: '#EFFBF5',
          100: '#D7F5E7',
          200: '#ADEBCE',
          300: '#79DBB0',
          400: '#42C892',
          /** The brand pop — fills, badges, swatch rings. */
          500: '#16B378',
          /** Primary button / link mint: passes AA on white. */
          600: '#0D8E5E',
          700: '#0A6F4A',
          800: '#08563A',
          900: '#073F2B',
        },
        /** Markdowns only. */
        sale: '#D7263D',
      },
      fontFamily: {
        // Bound to next/font CSS variables (see app/fonts.ts)
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.28em',
        wider2: '0.14em',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
