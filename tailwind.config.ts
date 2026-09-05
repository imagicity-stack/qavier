import type { Config } from 'tailwindcss';

/**
 * Qavier runs two visual universes from one design system.
 *
 *  • LUXE  → quiet luxury. Noir, ivory, champagne gold. Serif display, wide tracking, slow fades.
 *  • POPS  → Gen-Z energy. Acid greens, hot magenta, electric violet & cyan. Chunky type, motion, grain.
 *
 * Both palettes live here as namespaced tokens so components never guess at hex values.
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
        // ——————————————————————————————————————————————
        // QAVIER LUXE — quiet luxury
        // ——————————————————————————————————————————————
        luxe: {
          noir: '#0B0B0C',
          ink: '#16161A',
          charcoal: '#26262B',
          stone: '#8A8377',
          taupe: '#B7AD9E',
          champagne: '#C9A96A',
          gold: '#B8945F',
          goldlight: '#E4CfA0',
          ivory: '#F6F1E7',
          cream: '#FBF8F1',
          porcelain: '#FCFBF8',
          wine: '#3E1F2B',
        },
        // ——————————————————————————————————————————————
        // QAVIER POPS — Gen-Z maximalism
        // ——————————————————————————————————————————————
        pops: {
          black: '#0E0E12',
          ink: '#1A1A22',
          magenta: '#FF2E93',
          pink: '#FF6BB5',
          violet: '#8B5CF6',
          purple: '#A855F7',
          lime: '#C6FF1A',
          acid: '#B4FF39',
          cyan: '#00E5FF',
          blue: '#2D6BFF',
          yellow: '#FFE600',
          orange: '#FF6A2C',
          cream: '#FFF8E7',
          paper: '#FDFCF7',
        },
      },
      fontFamily: {
        // Bound to next/font CSS variables (see app/fonts.ts)
        // NB: the Luxe "display" token — now a modern sans (Manrope), not a serif.
        serif: ['var(--font-serif)', 'Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Space Grotesk', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.28em',
        wider2: '0.18em',
      },
      borderRadius: {
        pops: '1.75rem',
        blob: '42% 58% 63% 37% / 41% 44% 56% 59%',
      },
      boxShadow: {
        luxe: '0 30px 80px -40px rgba(0,0,0,0.45)',
        pops: '6px 6px 0 0 #0E0E12',
        'pops-lg': '10px 10px 0 0 #0E0E12',
        // For cards sitting on the dark Pops background, where a black
        // offset shadow would simply disappear.
        'pops-lime': '6px 6px 0 0 #C6FF1A',
        'pops-lime-lg': '10px 10px 0 0 #C6FF1A',
        glow: '0 0 40px -8px rgba(255,46,147,0.55)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-rev': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        spinslow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        wobble: {
          '0%,100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'marquee-fast': 'marquee 14s linear infinite',
        'marquee-rev': 'marquee-rev 28s linear infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        spinslow: 'spinslow 14s linear infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        'fade-up': 'fade-up 0.9s cubic-bezier(0.22,1,0.36,1) both',
        wobble: 'wobble 0.5s ease-in-out infinite',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
