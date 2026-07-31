import Script from 'next/script';
import { GA_MEASUREMENT_ID } from '@/lib/config';

/**
 * Google Analytics 4 (gtag.js).
 *
 * Loaded from the root layout, so it covers every world — the hub, the Qavier
 * flagship, Pops, Luxe and Essentials. `afterInteractive` keeps the tag off the
 * critical path; it still fires well before a shopper can act on the page.
 *
 * Client-side route changes are covered by GA4's enhanced measurement, which
 * counts page views from browser history events (the App Router navigates with
 * pushState). No manual page_view call here — sending one as well would double
 * count every navigation.
 *
 * Set NEXT_PUBLIC_GA_MEASUREMENT_ID to point at a different property, or to
 * an empty value to switch analytics off entirely.
 */
export function Analytics() {
  // Keep local development out of the production property's reporting.
  if (!GA_MEASUREMENT_ID || process.env.NODE_ENV !== 'production') return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
