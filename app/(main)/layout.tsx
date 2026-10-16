import type { Metadata } from 'next';
import { CartProvider } from '@/components/shared/cart-context';
import { CartDrawer } from '@/components/shared/cart-drawer';
import { AnnouncementBar } from '@/components/store/announcement-bar';
import { SiteNav } from '@/components/store/site-nav';
import { SiteFooter } from '@/components/store/site-footer';
import { ComingSoon } from '@/components/coming-soon';
import { COMING_SOON, ACCOUNT_URL } from '@/lib/config';
import { buildNav } from '@/lib/nav';
import { getCollection, getCollections, getProducts } from '@/lib/shopify';
import type { Product } from '@/lib/shopify/types';

// The menu is built from Shopify collections, so the shell revalidates on the
// same clock as the catalogue pages inside it.
export const revalidate = 60;

export const metadata: Metadata = COMING_SOON
  ? {
      title: 'Coming Soon',
      description: 'The Qavier store opens soon.',
      robots: { index: false, follow: true },
    }
  : {};

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  // One gate for the whole shop — NEXT_PUBLIC_QAVIER_STORE=coming-soon.
  if (COMING_SOON) {
    return <ComingSoon />;
  }

  // Fetched once for the whole shell: the header menu and the footer's Shop
  // column read the same list, so they can never disagree.
  const [collections, trending] = await Promise.all([
    getCollections(),
    getProducts({ sortKey: 'BEST_SELLING', first: 4 }),
  ]);
  const nav = buildNav(collections);

  // The four products on the right of each department's mega-menu.
  const handles = Array.from(new Set(nav.flatMap((item) => (item.featured ? [item.featured] : []))));
  const featuredEntries = await Promise.all(
    handles.map(async (handle) => {
      const collection = await getCollection(handle, { first: 4, sortKey: 'BEST_SELLING' });
      return [handle, collection?.products.slice(0, 4) ?? []] as const;
    }),
  );
  const featured: Record<string, Product[]> = Object.fromEntries(featuredEntries);

  return (
    <CartProvider>
      <div className="flex min-h-[100dvh] flex-col bg-paper text-ink selection:bg-accent selection:text-ink">
        <AnnouncementBar />
        <SiteNav items={nav} featured={featured} trending={trending} accountHref={ACCOUNT_URL} />
        <main className="flex-1">{children}</main>
        <SiteFooter collections={collections} accountHref={ACCOUNT_URL} />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
