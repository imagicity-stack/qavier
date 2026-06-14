import type { Metadata, Viewport } from 'next';
import { display, sans, serif } from './fonts';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'QAVIER — Two Worlds, One Name',
    template: '%s · QAVIER',
  },
  description:
    'Qavier is a fashion house in two universes. Qavier Luxe — quiet luxury, considered in every seam. Qavier Pops — loud, limited, Gen-Z energy.',
  keywords: ['Qavier', 'luxury fashion', 'streetwear', 'Qavier Luxe', 'Qavier Pops'],
  openGraph: {
    title: 'QAVIER — Two Worlds, One Name',
    description: 'Choose your universe. Qavier Luxe or Qavier Pops.',
    url: siteUrl,
    siteName: 'Qavier',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QAVIER',
    description: 'Two worlds, one name. Qavier Luxe & Qavier Pops.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0b0b0c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-luxe-noir text-luxe-cream antialiased">{children}</body>
    </html>
  );
}
