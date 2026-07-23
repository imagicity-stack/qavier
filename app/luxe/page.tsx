import type { Metadata } from 'next';
import { LuxeComingSoon } from '@/components/luxe-coming-soon';
import { LuxeLanding } from '@/components/luxe-landing';
import { LUXE_LIVE } from '@/lib/config';

export const metadata: Metadata = LUXE_LIVE
  ? {
      title: 'Qavier Luxe',
      description:
        'Qavier Luxe — investment pieces in virgin wool, mulberry silk and grade-A cashmere.',
    }
  : {
      title: 'Qavier Luxe — Coming Soon',
      description: 'Qavier Luxe is on its way. Meanwhile, shop the Qavier flagship.',
      robots: { index: false, follow: true },
    };

export default function LuxePage() {
  if (!LUXE_LIVE) {
    return <LuxeComingSoon />;
  }
  return <LuxeLanding />;
}
