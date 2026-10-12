/**
 * Colour names → swatch colours.
 *
 * Product cards show a dot per colourway, which means turning Shopify's free
 * text ("Jet Black", "Off White", "Olive Green") into something paintable.
 * Matching is longest-name-first on the normalised string, so "off white"
 * wins over "white" and "navy blue" over "blue".
 *
 * Anything unrecognised gets a stable colour derived from its own name — the
 * same word always produces the same dot, so a store using its own vocabulary
 * still gets a consistent grid instead of a row of grey circles.
 */
import { seededHue } from './utils';

const NAMED: Record<string, string> = {
  // Neutrals
  black: '#121212',
  'jet black': '#0A0A0A',
  charcoal: '#36393B',
  graphite: '#3A3A3C',
  slate: '#5A6A72',
  grey: '#9AA0A6',
  gray: '#9AA0A6',
  'light grey': '#C9CDD1',
  'light gray': '#C9CDD1',
  'heather grey': '#B6BBC0',
  'heather gray': '#B6BBC0',
  silver: '#C8CDD2',
  white: '#FFFFFF',
  'off white': '#F4F1EA',
  ivory: '#F6F2E6',
  cream: '#F3EAD6',
  ecru: '#EDE4D3',
  bone: '#E8E1D4',
  // Earths
  beige: '#DCC9A8',
  sand: '#D8C3A0',
  stone: '#CFC6B8',
  taupe: '#A89883',
  oat: '#DFD3BC',
  khaki: '#A69668',
  camel: '#B98F5A',
  tan: '#C79A62',
  brown: '#6B4A33',
  chocolate: '#4A2F22',
  coffee: '#44332A',
  rust: '#9B4722',
  terracotta: '#B4603C',
  // Greens
  mint: '#16B378',
  'mint green': '#16B378',
  sage: '#9DAF95',
  olive: '#6B6B3A',
  'olive green': '#6B6B3A',
  army: '#5A5C3A',
  forest: '#1F4B35',
  green: '#2E8B57',
  'bottle green': '#14543C',
  lime: '#A8D44A',
  teal: '#1F7A74',
  // Blues
  navy: '#1B2A4A',
  'navy blue': '#1B2A4A',
  blue: '#2A5CAA',
  'royal blue': '#2A4FB5',
  'sky blue': '#86BCE3',
  sky: '#86BCE3',
  'baby blue': '#A9CDE8',
  denim: '#4A6A8A',
  indigo: '#3B3F7A',
  powder: '#C6D8E6',
  // Warms
  yellow: '#E8C341',
  mustard: '#C9A227',
  gold: '#C9A227',
  orange: '#E07A2F',
  peach: '#F0B99A',
  coral: '#E8705F',
  red: '#C62B2B',
  maroon: '#5E1F28',
  burgundy: '#5A1B2D',
  wine: '#58202F',
  // Pinks & purples
  pink: '#E29AB4',
  blush: '#EBC2C8',
  fuchsia: '#C2317E',
  magenta: '#B8246E',
  lavender: '#B9AEDC',
  lilac: '#C3B3DD',
  purple: '#6B4B9A',
  // Catch-alls
  multi: '#9AA0A6',
  multicolour: '#9AA0A6',
  multicolor: '#9AA0A6',
  print: '#9AA0A6',
};

// Longest first, so a two-word match beats the single word inside it.
const ENTRIES = Object.entries(NAMED).sort((a, b) => b[0].length - a[0].length);

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z]+/g, ' ').trim();

/** A CSS colour for a colourway name. Never returns empty. */
export function swatchColor(value: string): string {
  const name = normalize(value);
  if (!name) return '#9AA0A6';

  if (NAMED[name]) return NAMED[name];
  for (const [key, hex] of ENTRIES) {
    if (name.includes(key)) return hex;
  }

  // Unknown vocabulary: stable, mid-tone, derived from the name itself.
  return `hsl(${seededHue(name)} 32% 58%)`;
}

/** True for an option that names a colourway, in any casing or spelling. */
export function isColorOption(name: string): boolean {
  const n = name.trim().toLowerCase();
  return n === 'color' || n === 'colour' || n === 'colorway' || n === 'colourway';
}

/** Near-white swatches need an outline or they vanish against paper. */
export function needsSwatchBorder(hex: string): boolean {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return false;
  const int = parseInt(m[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  // Rec. 709 luminance — anything this bright reads as white on white.
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 232;
}
