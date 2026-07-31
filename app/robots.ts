import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';

/**
 * Served at /robots.txt. Everything is crawlable except the per-shopper pages
 * and the API — they hold nothing worth indexing, and keeping them out stops
 * crawlers burning budget on empty carts.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/checkout', '/order-confirmed', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
