import type { Metadata } from 'next';
import { Portal } from '@/components/portal/portal';

export const metadata: Metadata = {
  title: 'QAVIER — Choose Your Universe',
  description:
    'Two worlds, one name. Enter Qavier Luxe for quiet luxury, or Qavier Pops for loud, limited Gen-Z energy.',
};

export default function PortalPage() {
  return <Portal />;
}
