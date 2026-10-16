import type { Config } from 'tailwindcss';

/**
 * The Qavier palette.
 *
 * Black on white for the page itself, a light grey wash for image wells, and
 * the deep-forest footer. Product photography carries the colour; the chrome
 * stays out of its way. Qavier mint is the one accent — promo badges and the
 * sign-up button.
 *
 * `sale` is reserved for markdowns — sale prices, the Sale menu item and
 * discount notes — so a price cut reads as one at a glance.
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
        /** Body copy, headings, buttons, the announcement bar, the footer. */
        ink: '#111111',
        paper: '#FFFFFF',
        /** Image wells and bands that need to lift off paper. */
        shell: '#F3F3F3',
        /** Hairlines and input borders. */
        line: '#E2E2E2',
        /** Secondary copy — passes AA on paper and on shell. */
        mute: '#6B6B6B',
        /** Markdowns only. */
        sale: '#D0021B',
        /** The footer — deep forest, the darkest note in the Qavier palette. */
        forest: '#0C231B',
        /** Qavier mint — promo badges and the sign-up button. */
        accent: {
          DEFAULT: '#7FD9B0',
          soft: '#CFF1E2',
        },
      },
      fontFamily: {
        // Bound to next/font CSS variables (see app/fonts.ts)
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
      },
      letterSpacing: {
        luxe: '0.28em',
        wider2: '0.12em',
      },
      maxWidth: {
        site: '96rem',
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
