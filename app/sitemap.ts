import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/shopify';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '',
    '/luxe',
    '/luxe/shop',
    '/luxe/collection',
    '/luxe/about',
    '/luxe/journal',
    '/pops',
    '/pops/shop',
    '/pops/drops',
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const products = await getProducts();
  const productRoutes = products.map((p) => ({
    url: `${siteUrl}/${p.universe}/products/${p.handle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
