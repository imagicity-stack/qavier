import type { Metadata } from 'next';
import { getProducts } from '@/lib/shopify';
import { LuxeShop } from '@/components/luxe/luxe-shop';

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Shop the Qavier Luxe wardrobe — tailoring, outerwear, knitwear and eveningwear in the finest cloth. Filter by category, size, colour and price.',
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string | string[] };
}) {
  const products = await getProducts({ universe: 'luxe' });
  const initialCategory =
    typeof searchParams.category === 'string' ? searchParams.category : 'all';

  return <LuxeShop products={products} initialCategory={initialCategory} />;
}
