import type { Metadata } from 'next';
import { CartProvider } from '@/components/shared/cart-context';
import { LuxeNav } from '@/components/luxe/luxe-nav';
import { LuxeFooter } from '@/components/luxe/luxe-footer';
import { ComingSoon } from '@/components/coming-soon';
import { COMING_SOON } from '@/lib/config';

export const metadata: Metadata = COMING_SOON
  ? {
      title: 'Coming Soon',
      description: 'The Qavier store is opening soon. Meanwhile, shop Qavier Pops.',
      // Keep the pre-launch store out of search results.
      robots: { index: false, follow: true },
    }
  : {
      title: 'Timeless Fashion, Modern Elegance',
      description:
        'Qavier. Investment pieces in virgin wool, mulberry silk and grade-A cashmere. Considered in every seam.',
    };

export default function MainLayout({ children }: { children: React.ReactNode }) {
  // Pre-launch: hold the entire main store behind one gate. Flip it live via
  // NEXT_PUBLIC_QAVIER_STORE=live (see lib/config.ts). Qavier Pops is a separate
  // route group and is unaffected.
  if (COMING_SOON) {
    return <ComingSoon />;
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-luxe-cream font-sans text-luxe-noir selection:bg-luxe-gold/30">
        <LuxeNav />
        <main>{children}</main>
        <LuxeFooter />
      </div>
    </CartProvider>
  );
}
