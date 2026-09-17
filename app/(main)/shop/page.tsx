import type { Metadata } from 'next';
import { getProducts } from '@/lib/shopify';
import { ShopGrid } from '@/components/store/shop-grid';

// Catalogue pages are regenerated at most this often, so Shopify price and
// stock edits reach the storefront without a redeploy. The /api/revalidate
// webhook flushes them immediately when Shopify pushes a change.
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Shop',
  description: 'The full Qavier collection — considered pieces, made in small runs.',
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { q?: string | string[]; category?: string | string[] };
}) {
  const query = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const category =
    typeof searchParams.category === 'string' ? searchParams.category : 'all';

  const products = await getProducts({ query, sortKey: 'CREATED_AT', reverse: true });

  return (
    <section className="mx-auto max-w-[90rem] px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
      <header className="mb-10">
        <p className="label">{query ? 'Search' : 'The collection'}</p>
        <h1 className="mt-4 font-display text-3xl font-light text-ink sm:text-4xl">
          {query ? `“${query}”` : 'Shop all'}
        </h1>
        <p className="mt-3 text-sm text-ink/45">
          {products.length} {products.length === 1 ? 'piece' : 'pieces'}
        </p>
      </header>

      {/* Re-key on the search term so a new search resets the filters. */}
      <ShopGrid key={query ?? 'all'} products={products} initialCategory={category} />
    </section>
  );
}
