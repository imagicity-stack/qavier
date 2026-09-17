import type { MetadataRoute } from 'next';
import { getAllProductRefs } from '@/lib/shopify';
import { LEGAL_DOCS } from '@/lib/legal';
import { COMING_SOON, SITE_URL } from '@/lib/config';

/**
 * Served at /sitemap.xml, and pointed to by /robots.txt.
 *
 * Nothing is listed while the store sits behind its coming-soon gate. Cart,
 * checkout and
 * order confirmation are deliberately absent (see robots.ts, which disallows
 * them): they're per-shopper pages with nothing to crawl.
 *
 * Regenerated hourly so products added in Shopify get listed without a
 * redeploy; the /api/revalidate webhook refreshes it immediately on a
 * catalogue change, since it reads through the same `products` cache tag.
 */
export const revalidate = 3600;

interface Entry {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // The hub is always listed. Each world is only advertised once it's live.
  const entries: Entry[] = [{ path: '', priority: 1, changeFrequency: 'weekly' }];

  // Policies live outside every world's gate, so they are always listed.
  for (const doc of LEGAL_DOCS) {
    entries.push({
      path: `/legal/${doc.slug}`,
      priority: 0.3,
      changeFrequency: 'yearly',
    });
  }

  if (!COMING_SOON) {
    entries.push(
      { path: '/shop', priority: 0.9, changeFrequency: 'daily' },
      { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
    );
  }

  const staticRoutes: MetadataRoute.Sitemap = entries.map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  const productRoutes: MetadataRoute.Sitemap = (await getAllProductRefs())
    .filter(() => !COMING_SOON)
    .map((p) => ({
      url: `${SITE_URL}/products/${p.handle}`,
      // Shopify's own updatedAt, so <lastmod> reflects a real edit rather than
      // "whenever this sitemap was built".
      lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...productRoutes];
}
