import type { Metadata } from 'next';
import { EssentialsComingSoon } from '@/components/essentials-coming-soon';
import { EssentialsStore } from '@/components/essentials-store';
import { ESSENTIALS_LIVE } from '@/lib/config';

export const metadata: Metadata = ESSENTIALS_LIVE
  ? {
      title: 'Qavier Essentials',
      description: 'Qavier Essentials — quietly perfect everyday basics, built to repeat.',
    }
  : {
      title: 'Qavier Essentials — Coming Soon',
      description: 'Qavier Essentials is on its way. Meanwhile, shop the Qavier flagship.',
      robots: { index: false, follow: true },
    };

export default function EssentialsPage() {
  if (!ESSENTIALS_LIVE) {
    return <EssentialsComingSoon />;
  }
  return <EssentialsStore />;
}
