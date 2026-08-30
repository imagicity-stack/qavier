'use client';

import { useState } from 'react';
import { ShopImage } from '@/components/shared/shop-image';
import type { Image } from '@/lib/shopify/types';
import { cn, galleryAspectRatio } from '@/lib/utils';

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
  // Frame shaped by the store's own photography, so nothing has to be cropped.
  // Taken from the first image so switching views never shifts the layout.
  const ratio = galleryAspectRatio(gallery[0], 3 / 4);

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {/*
        Capped against the viewport so a tall photo doesn't fill a whole phone
        screen on its own. Applied as a max-WIDTH derived from the ratio, so the
        frame keeps the photo's shape and centres rather than letterboxing; at
        `lg` the value never binds and the column governs.
      */}
      <div
        className="mx-auto w-full [--gal-h:52svh] sm:[--gal-h:68svh] lg:[--gal-h:1200px]"
        style={{ maxWidth: `calc(var(--gal-h) * ${ratio})` }}
      >
        <ShopImage
          image={current}
          universe="luxe"
          priority
          fit="contain"
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="w-full bg-luxe-ivory"
          style={{ aspectRatio: String(ratio) }}
          label={`${title} — View ${active + 1}`}
        />
      </div>

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
                fit="contain"
                sizes="25vw"
                className="h-full w-full bg-luxe-ivory"
                label={`${i + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
