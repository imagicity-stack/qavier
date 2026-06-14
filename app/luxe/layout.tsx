import type { Metadata } from 'next';
import { CartProvider } from '@/components/shared/cart-context';
import { CartDrawer } from '@/components/shared/cart-drawer';
import { LuxeNav } from '@/components/luxe/luxe-nav';
import { LuxeFooter } from '@/components/luxe/luxe-footer';

export const metadata: Metadata = {
  title: 'Qavier Luxe — Quiet Luxury',
  description:
    'Qavier Luxe. Investment pieces in virgin wool, mulberry silk and grade-A cashmere. Considered in every seam.',
};

export default function LuxeLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-luxe-cream font-sans text-luxe-noir selection:bg-luxe-gold/30">
        <LuxeNav />
        <main>{children}</main>
        <LuxeFooter />
        <CartDrawer universe="luxe" />
      </div>
    </CartProvider>
  );
}
