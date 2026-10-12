import type { Metadata } from 'next';
import { CartProvider } from '@/components/shared/cart-context';
import { CartDrawer } from '@/components/shared/cart-drawer';
import { AnnouncementBar } from '@/components/store/announcement-bar';
import { SiteNav } from '@/components/store/site-nav';
import { SiteFooter } from '@/components/store/site-footer';
import { ComingSoon } from '@/components/coming-soon';
import { COMING_SOON } from '@/lib/config';
import { buildNav } from '@/lib/nav';
import { getCollections } from '@/lib/shopify';

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
  // column are the same list, so they can never disagree.
  const collections = await getCollections();

  return (
    <CartProvider>
      <div className="flex min-h-[100dvh] flex-col bg-paper text-ink selection:bg-mint-200 selection:text-ink">
        <AnnouncementBar />
        <SiteNav items={buildNav(collections)} />
        <main className="flex-1">{children}</main>
        <SiteFooter collections={collections} />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
