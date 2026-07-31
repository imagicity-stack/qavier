/**
 * Site-level switches.
 *
 * The landing page (`/`) is a 2×2 hub with four worlds:
 *
 *   1. Qavier      → the flagship store at /qavier. Always open (no flag).
 *   2. Luxe        → /luxe        — gated by NEXT_PUBLIC_LUXE_STORE
 *   3. Pops        → /pops        — gated by NEXT_PUBLIC_POPS_STORE
 *   4. Essentials  → /essentials  — gated by NEXT_PUBLIC_ESSENTIALS_STORE
 *
 * Each gated world defaults to a "coming soon" holding page. Flip one live —
 * with no code change — by setting its env var to `live` (Vercel → Settings →
 * Environment Variables, or your local .env.local) and redeploying. Any other
 * value (including unset) keeps it in "coming soon".
 */
function isLive(value: string | undefined): boolean {
  return value === 'live';
}

/** Qavier Luxe — the premium line. */
export const LUXE_LIVE = isLive(process.env.NEXT_PUBLIC_LUXE_STORE);
/** Qavier Pops — already built; revealed when flipped live. */
export const POPS_LIVE = isLive(process.env.NEXT_PUBLIC_POPS_STORE);
/** Qavier Essentials — the everyday basics line. */
export const ESSENTIALS_LIVE = isLive(process.env.NEXT_PUBLIC_ESSENTIALS_STORE);

// ── Legacy: whole-Qavier-store holding switch (the flagship is now always
//    open via the hub, so this defaults to live). Kept for the /qavier gate.
const STORE_LIVE_FALLBACK = true;

export const STORE_LIVE: boolean =
  process.env.NEXT_PUBLIC_QAVIER_STORE === 'live'
    ? true
    : process.env.NEXT_PUBLIC_QAVIER_STORE === 'coming-soon'
      ? false
      : STORE_LIVE_FALLBACK;

/** When true, the flagship store shows the "coming soon" holding page. */
export const COMING_SOON = !STORE_LIVE;

/**
 * Google Analytics 4 measurement ID. Defaults to the Qavier property; override
 * with NEXT_PUBLIC_GA_MEASUREMENT_ID, or set it to an empty value to turn
 * analytics off. The tag only loads in production builds.
 */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? 'G-PSJ1WV8V5X';
