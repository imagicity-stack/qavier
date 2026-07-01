import type { Metadata } from 'next';
import { CartProvider } from '@/components/shared/cart-context';
import { LuxeNav } from '@/components/luxe/luxe-nav';
import { LuxeFooter } from '@/components/luxe/luxe-footer';

export const metadata: Metadata = {
  title: 'Timeless Fashion, Modern Elegance',
  description:
    'Qavier. Investment pieces in virgin wool, mulberry silk and grade-A cashmere. Considered in every seam.',
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
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
