import type { Metadata } from 'next';
import { CartProvider } from '@/components/shared/cart-context';
import { CartDrawer } from '@/components/shared/cart-drawer';
import { SiteNav } from '@/components/store/site-nav';
import { SiteFooter } from '@/components/store/site-footer';
import { ComingSoon } from '@/components/coming-soon';
import { COMING_SOON } from '@/lib/config';

export const metadata: Metadata = COMING_SOON
  ? {
      title: 'Coming Soon',
      description: 'The Qavier store opens soon.',
      robots: { index: false, follow: true },
    }
  : {};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  // One gate for the whole shop — NEXT_PUBLIC_QAVIER_STORE=coming-soon.
  if (COMING_SOON) {
    return <ComingSoon />;
  }

  return (
    <CartProvider>
      <div className="flex min-h-[100dvh] flex-col bg-paper text-ink selection:bg-ink selection:text-paper">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
