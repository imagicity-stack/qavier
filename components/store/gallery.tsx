'use client';

import { useState } from 'react';
import { ShopImage } from '@/components/shared/shop-image';
import type { Image } from '@/lib/shopify/types';
import { cn, galleryAspectRatio } from '@/lib/utils';

/**
 * Product gallery: one large frame with thumbnails beneath.
 *
 * The frame takes its shape from the store's own photography and the photo is
 * contained, never cropped — a shopper judging a garment needs to see all of
 * it. Shape comes from the first image, so switching thumbnails never shifts
 * the layout, and the height is capped against the viewport so a tall photo
 * can't swallow a phone screen on its own.
 */
export function Gallery({ images, title }: { images: Image[]; title: string }) {
  const gallery = images.length ? images : [];
  const [active, setActive] = useState(0);
  const main = gallery[active] ?? gallery[0];
  const ratio = galleryAspectRatio(gallery[0], 4 / 5);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div
        className="mx-auto w-full bg-shell [--gal-h:56svh] sm:[--gal-h:70svh] lg:[--gal-h:1200px]"
        style={{ maxWidth: `calc(var(--gal-h) * ${ratio})` }}
      >
        <ShopImage
          image={main}
          priority
          fit="contain"
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="w-full"
          style={{ aspectRatio: String(ratio) }}
          label={title}
        />
      </div>

      {gallery.length > 1 && (
        <div className="scrollbar-none flex w-full min-w-0 gap-2 overflow-x-auto pb-1">
          {gallery.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${gallery.length}`}
              aria-pressed={i === active}
              className={cn(
                'relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-shell transition-opacity sm:w-20',
                i === active ? 'ring-1 ring-ink' : 'opacity-60 hover:opacity-100',
              )}
            >
              <ShopImage
                image={img}
                fit="contain"
                sizes="80px"
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
