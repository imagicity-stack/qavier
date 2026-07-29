import type { Metadata } from 'next';
import { getProducts } from '@/lib/shopify';
import { LuxeShop } from '@/components/luxe/luxe-shop';

// Catalogue pages are regenerated at most this often, so Shopify price and
// stock edits reach the storefront without a redeploy. The /api/revalidate
// webhook flushes them immediately when Shopify pushes a change.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Shop the Qavier wardrobe — tailoring, outerwear, knitwear and eveningwear in the finest cloth. Filter by category, size, colour and price.',
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string | string[]; q?: string | string[] };
}) {
  const products = await getProducts({ section: 'qavier' });
  const initialCategory =
    typeof searchParams.category === 'string' ? searchParams.category : 'all';
  const initialQuery = typeof searchParams.q === 'string' ? searchParams.q : '';

  return (
    // Re-key on the query so a fresh header search resets the grid's filter state.
    <LuxeShop
      key={initialQuery}
      products={products}
      initialCategory={initialCategory}
      initialQuery={initialQuery}
    />
  );
}
