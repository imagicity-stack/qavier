import type { MetadataRoute } from 'next';
import { getAllCollectionRefs, getAllProductRefs } from '@/lib/shopify';
import { LEGAL_DOCS } from '@/lib/legal';
import { COMING_SOON, SITE_URL } from '@/lib/config';

/**
 * Served at /sitemap.xml, and pointed to by /robots.txt.
 *
 * While the store sits behind its coming-soon gate only the home page and the
 * policies are listed — everything else 404s to a crawler, and listing a page
 * that isn't there is worse than listing nothing. Cart, checkout and order
 * confirmation are deliberately absent (robots.ts disallows them too): they're
 * per-shopper pages with nothing to crawl.
 *
 * Regenerated hourly so products and collections added in Shopify get listed
 * without a redeploy; the /api/revalidate webhook refreshes it immediately on a
 * catalogue change, since it reads through the same cache tags.
 */
export const revalidate = 3600;

interface Entry {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: Entry[] = [{ path: '', priority: 1, changeFrequency: 'weekly' }];

  // Policies live outside the store's gate, so they are always listed.
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
      { path: '/collections', priority: 0.8, changeFrequency: 'weekly' },
      { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
    );
  }

  const staticRoutes: MetadataRoute.Sitemap = entries.map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  // Nothing catalogue-shaped is reachable behind the gate, so don't ask
  // Shopify for it either.
  if (COMING_SOON) return staticRoutes;

  const [products, collections] = await Promise.all([
    getAllProductRefs(),
    getAllCollectionRefs(),
  ]);

  // Shopify's own updatedAt, so <lastmod> reflects a real edit rather than
  // "whenever this sitemap was built".
  const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${SITE_URL}/collections/${c.handle}`,
    lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/products/${p.handle}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
