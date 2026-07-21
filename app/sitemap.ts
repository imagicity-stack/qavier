import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/shopify';
import { COMING_SOON } from '@/lib/config';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // While the main store is pre-launch, only advertise the home page and the
  // live Pops universe; the store's inner routes stay out of the sitemap.
  const mainRoutes = COMING_SOON ? [''] : ['', '/shop', '/collection', '/about', '/journal'];
  const staticRoutes = [...mainRoutes, '/pops', '/pops/shop', '/pops/drops'].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const products = await getProducts();
  const productRoutes = products
    // Hide main-store product pages until launch; Pops products stay listed.
    .filter((p) => !COMING_SOON || p.universe === 'pops')
    .map((p) => ({
      // Qavier products sit at the root; Pops products stay under /pops.
      url: `${siteUrl}${p.universe === 'pops' ? '/pops' : ''}/products/${p.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

  return [...staticRoutes, ...productRoutes];
}
