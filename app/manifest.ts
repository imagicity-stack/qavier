import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Qavier — Timeless Fashion, Modern Elegance',
    short_name: 'Qavier',
    description: 'Qavier — considered, timeless fashion. Plus Qavier Pops, loud and limited.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0b0c',
    theme_color: '#0b0b0c',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
