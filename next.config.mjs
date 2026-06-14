/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Shopify CDN — where product imagery is served from once the store is connected.
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      // Generic Unsplash/placeholder hosts so the demo looks alive before real photos land.
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
  experimental: {
    // Keep server actions tidy for the cart mutations.
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
