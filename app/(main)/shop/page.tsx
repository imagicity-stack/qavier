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

  const products = await getProducts({ query, sortKey: 'CREATED_AT', reverse: true });

  return (
    <>
      <header className="px-4 pb-9 pt-9 text-center sm:px-6 sm:pt-11">
        {query && <p className="text-[0.85rem] text-mute">Search results for</p>}
        <h1 className="h-page mt-1">{query ? `“${query}”` : 'Shop All'}</h1>
      </header>

      {/* Re-key on the search term so a new search resets the filters. */}
      <ShopGrid key={query ?? 'all'} products={products} initialCategory={category} />
    </>
  );
}
