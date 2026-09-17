import type { Config } from 'tailwindcss';

/**
 * One store, one palette.
 *
 * Near-black ink on paper, a warm off-white for alternating bands, and a single
 * hairline. Restraint is the design — anything that needs more than these five
 * tokens probably needs less decoration instead.
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
        ink: '#111111',
        paper: '#FFFFFF',
        /** Warm off-white, for bands that need to separate from paper. */
        shell: '#F6F4F1',
        /** The only rule colour on the site. */
        line: '#E6E2DC',
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
