import type { Metadata } from 'next';
import { CartProvider } from '@/components/shared/cart-context';
import { CartDrawer } from '@/components/shared/cart-drawer';
import { PopsNav } from '@/components/pops/pops-nav';
import { PopsFooter } from '@/components/pops/pops-footer';
import { PopsComingSoon } from '@/components/pops-coming-soon';
import { POPS_LIVE } from '@/lib/config';

export const metadata: Metadata = POPS_LIVE
  ? {
      title: 'Qavier Pops — Loud, Limited, Yours',
      description:
        'Qavier Pops. Drops, not collections. Hyperpop cargos, glitchcore tees & iridescent everything. Gone before you finish scrolling.',
    }
  : {
      title: 'Qavier Pops — Coming Soon',
      description: 'Qavier Pops is dropping soon. Meanwhile, shop the Qavier flagship.',
      robots: { index: false, follow: true },
    };

export default function PopsLayout({ children }: { children: React.ReactNode }) {
  // Held behind a "coming soon" page until NEXT_PUBLIC_POPS_STORE=live.
  if (!POPS_LIVE) {
    return <PopsComingSoon />;
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-pops-black font-sans text-pops-cream selection:bg-pops-lime selection:text-pops-black">
        <PopsNav />
        <main>{children}</main>
        <PopsFooter />
        <CartDrawer universe="pops" />
      </div>
    </CartProvider>
  );
}
