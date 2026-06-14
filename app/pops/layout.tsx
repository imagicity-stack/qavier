import type { Metadata } from 'next';
import { CartProvider } from '@/components/shared/cart-context';
import { CartDrawer } from '@/components/shared/cart-drawer';
import { PopsNav } from '@/components/pops/pops-nav';
import { PopsFooter } from '@/components/pops/pops-footer';

export const metadata: Metadata = {
  title: 'Qavier Pops — Loud, Limited, Yours',
  description:
    'Qavier Pops. Drops, not collections. Hyperpop cargos, glitchcore tees & iridescent everything. Gone before you finish scrolling.',
};

export default function PopsLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-pops-paper font-sans text-pops-black selection:bg-pops-lime">
        <PopsNav />
        <main>{children}</main>
        <PopsFooter />
        <CartDrawer universe="pops" />
      </div>
    </CartProvider>
  );
}
