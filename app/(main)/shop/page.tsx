import type { Metadata } from 'next';
import { getProducts } from '@/lib/shopify';
import { ShopGrid } from '@/components/store/shop-grid';

// Catalogue pages are regenerated at most this often, so Shopify price and
// stock edits reach the storefront without a redeploy. The /api/revalidate
// webhook flushes them immediately when Shopify pushes a change.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Shop All',
  description: 'The full Qavier collection — polos, tees, layers and accessories.',
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { q?: string | string[]; category?: string | string[] };
}) {
  const query = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const category = typeof searchParams.category === 'string' ? searchParams.category : 'all';

  // ?category= narrows to one product type (the menu's Shop column links
  // here). It's sent to Shopify as part of the search, so the grid holds every
  // product of that type rather than the matching few among the newest 100.
  const typeFilter =
    category !== 'all' ? `product_type:"${category.replace(/["\\]/g, '').trim()}"` : '';
  const search = [query, typeFilter].filter(Boolean).join(' ') || undefined;
  const products = await getProducts({ query: search, sortKey: 'CREATED_AT', reverse: true, first: 100 });

  const typeTitle =
    category !== 'all'
      ? products.find((p) => p.productType?.trim().toLowerCase() === category.trim().toLowerCase())
          ?.productType
      : undefined;

  return (
    <>
      <header className="px-4 pb-9 pt-9 text-center sm:px-6 sm:pt-11">
        {query && <p className="text-[0.85rem] text-mute">Search results for</p>}
        <h1 className="h-page mt-1">{query ? `“${query}”` : typeTitle ?? 'Shop All'}</h1>
      </header>

      {/* Re-key on the search and the category so either resets the filters. */}
      <ShopGrid key={`${query ?? ''}|${category}`} products={products} initialCategory={category} />
    </>
  );
}
