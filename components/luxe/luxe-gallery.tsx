'use client';

import { useState } from 'react';
import { ShopImage } from '@/components/shared/shop-image';
import type { Image } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

/**
 * Luxe product gallery — a large main frame with selectable thumbnails.
 * Images are placeholders in demo mode; swapping the active index simply
 * re-labels the main frame so the interaction reads correctly today and
 * carries real photography seamlessly once Shopify is connected.
 */
export function LuxeGallery({ images, title }: { images: Image[]; title: string }) {
  const gallery = images.length ? images : [];
  const [active, setActive] = useState(0);
  const current = gallery[active];

  return (
    <div className="flex flex-col gap-4">
      <ShopImage
        image={current}
        universe="luxe"
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="aspect-[3/4] w-full bg-luxe-ivory"
        label={`${title} — View ${active + 1}`}
      />

      {gallery.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {gallery.map((image, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${title} view ${i + 1}`}
              aria-pressed={i === active}
              className={cn(
                'relative aspect-[3/4] w-full overflow-hidden bg-luxe-ivory transition-all duration-300 ease-luxe',
                i === active
                  ? 'ring-1 ring-luxe-noir ring-offset-2 ring-offset-luxe-cream'
                  : 'opacity-70 hover:opacity-100',
              )}
            >
              <ShopImage
                image={image}
                universe="luxe"
                sizes="25vw"
                className="h-full w-full"
                label={`${i + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
