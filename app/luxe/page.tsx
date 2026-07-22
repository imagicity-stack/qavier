import type { Metadata } from 'next';
import { ComingSoon } from '@/components/coming-soon';

export const metadata: Metadata = {
  title: 'Qavier Luxe — Coming Soon',
  description:
    'Qavier Luxe is on its way — the premium line, considered in every seam. Meanwhile, shop Qavier Pops.',
  robots: { index: false, follow: true },
};

export default function LuxeComingSoonPage() {
  return (
    <ComingSoon
      eyebrow="Qavier Luxe"
      blurb="The premium line — investment pieces, considered in every seam — is being finished by hand. Join the list to be first through the door."
    />
  );
}
