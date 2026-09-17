import type { Metadata, Viewport } from 'next';
import { Analytics } from '@/components/shared/analytics';
import { SITE_URL } from '@/lib/config';
import { display, sans } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'QAVIER',
    template: '%s · QAVIER',
  },
  description:
    'Qavier — considered pieces, made in small runs. Designed and made in India.',
  keywords: ['Qavier', 'oversized t-shirts', 'streetwear', 'made in India'],
  openGraph: {
    title: 'QAVIER',
    description: 'Considered pieces, made in small runs.',
    url: SITE_URL,
    siteName: 'Qavier',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QAVIER',
    description: 'Considered pieces, made in small runs.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#111111',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Google tag (gtag.js) — first thing in the head, per Google. */}
        <Analytics />
      </head>
      <body className="bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
