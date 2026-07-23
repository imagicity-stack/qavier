import type { Metadata } from 'next';
import { ComingSoon } from '@/components/coming-soon';
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
    return (
      <ComingSoon
        eyebrow="Qavier Essentials"
        blurb="The everyday basics line — quietly perfect, built to repeat — is almost here. Join the list to be first to shop the drop."
      />
    );
  }
  return <EssentialsStore />;
}
