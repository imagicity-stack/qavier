import type { Metadata } from 'next';
import { IntroSplash } from '@/components/intro-splash';
import { Hub } from '@/components/hub';

export const metadata: Metadata = {
  title: 'Qavier — Four Worlds, One Name',
  description:
    'Enter Qavier. Choose your world — Qavier, Luxe, Pops or Essentials.',
};

export default function HubPage() {
  return (
    <>
      <IntroSplash />
      <Hub />
    </>
  );
}
