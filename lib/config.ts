/**
 * Site-level switches.
 *
 * One store, one door. The old four-world hub is gone, and with it the
 * per-world launch flags — the only gate left holds the whole shop behind a
 * coming-soon page.
 */

/**
 * Set NEXT_PUBLIC_QAVIER_STORE=coming-soon to hold the store behind its
 * holding page. Anything else (including unset) opens it.
 *
 * NB: this is the same variable that used to gate the flagship world, so a
 * deployment that still has it set to `coming-soon` will hold the ENTIRE site.
 */
export const COMING_SOON = process.env.NEXT_PUBLIC_QAVIER_STORE === 'coming-soon';

/**
 * Canonical site URL — used for metadata, robots.txt and the sitemap.
 *
 * Set NEXT_PUBLIC_SITE_URL to your own domain. Failing that we fall back to the
 * URL Vercel exposes, because a sitemap full of `http://localhost:3000` links
 * is worse than useless — search engines would index nothing.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  // Vercel's stable production domain, then the per-deployment URL.
  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;

  return 'http://localhost:3000';
}

export const SITE_URL = resolveSiteUrl();

/**
 * Google Analytics 4 measurement ID. Defaults to the Qavier property; override
 * with NEXT_PUBLIC_GA_MEASUREMENT_ID, or set it to an empty value to turn
 * analytics off. The tag only loads in production builds.
 */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? 'G-PSJ1WV8V5X';
