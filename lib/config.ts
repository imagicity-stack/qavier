/**
 * Site-level switches.
 *
 * ── Main Qavier store: "coming soon" vs live ──────────────────────────────
 * The main Qavier store (everything at the site root — home, shop, collections,
 * products, cart, checkout) can be held behind a "coming soon" page until you're
 * ready to sell. Qavier Pops (/pops) is a separate universe and is unaffected.
 *
 * Flip it ON (open the store) in one of two ways:
 *
 *   1. Recommended — no code change:
 *      Set the env var  NEXT_PUBLIC_QAVIER_STORE=live  (Vercel → Settings →
 *      Environment Variables, or your local .env.local) and redeploy.
 *      Set it to  coming-soon  to force the holding page back on.
 *
 *   2. Or edit one line here: change STORE_LIVE_FALLBACK to `true` and commit.
 *
 * The env var always wins over the fallback below.
 */
const STORE_LIVE_FALLBACK = false;

export const STORE_LIVE: boolean =
  process.env.NEXT_PUBLIC_QAVIER_STORE === 'live'
    ? true
    : process.env.NEXT_PUBLIC_QAVIER_STORE === 'coming-soon'
      ? false
      : STORE_LIVE_FALLBACK;

/** When true, the main store shows the "coming soon" holding page. */
export const COMING_SOON = !STORE_LIVE;
