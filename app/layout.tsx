import type { Metadata, Viewport } from 'next';
import { Analytics } from '@/components/shared/analytics';
import { display, sans, serif } from './fonts';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'QAVIER — Timeless Fashion, Modern Elegance',
    template: '%s · QAVIER',
  },
  description:
    'Qavier is a contemporary fashion house — considered, timeless pieces made to last. Discover the collection, or step into Qavier Pops for something loud and limited.',
  keywords: ['Qavier', 'luxury fashion', 'womenswear', 'streetwear', 'Qavier Pops'],
  openGraph: {
    title: 'QAVIER — Timeless Fashion, Modern Elegance',
    description: 'Considered, timeless pieces made to last. Plus Qavier Pops — loud, limited, iconic.',
    url: siteUrl,
    siteName: 'Qavier',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QAVIER',
    description: 'Timeless fashion, modern elegance — plus Qavier Pops.',
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
      <head>
        {/* Google tag (gtag.js) — first thing in the head, per Google. */}
        <Analytics />
      </head>
      <body className="bg-luxe-noir text-luxe-cream antialiased">{children}</body>
    </html>
  );
}
