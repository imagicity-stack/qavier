import { GA_MEASUREMENT_ID } from '@/lib/config';

/**
 * Google Analytics 4 (gtag.js) — the Google tag, exactly as issued for this
 * account, rendered into <head> from the root layout so it appears once at the
 * top of every page across all four worlds.
 *
 * Plain <script> tags rather than next/script: `beforeInteractive` is the only
 * next/script strategy that reaches the head, and it would block on the tag
 * before hydration for no benefit. These are server-rendered straight into the
 * initial HTML, so the tag fires as early as Google's own snippet does.
 *
 * Client-side route changes are covered by GA4's enhanced measurement, which
 * counts page views from browser history events (the App Router navigates with
 * pushState). No manual page_view call here — sending one as well would double
 * count every navigation.
 *
 * Set NEXT_PUBLIC_GA_MEASUREMENT_ID to point at a different property, or to an
 * empty value to switch analytics off.
 */
export function Analytics() {
  // Keep local development out of the production property's reporting.
  if (!GA_MEASUREMENT_ID || process.env.NODE_ENV !== 'production') return null;

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`,
        }}
      />
    </>
  );
}
