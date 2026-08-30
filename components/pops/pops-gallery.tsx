'use client';

import { useState } from 'react';
import { ShopImage } from '@/components/shared/shop-image';
import type { Image } from '@/lib/shopify/types';
import { cn, galleryAspectRatio } from '@/lib/utils';

/**
 * Pops product gallery. A big main image + a row of tappable thumbnails.
 * Works fine even when every image is a branded placeholder (demo mode).
 *
 * The frame takes its shape from the store's own photography and the photo is
 * contained, never cropped — a shopper deciding on a garment needs to see all
 * of it. The shape is fixed by the FIRST image so switching thumbnails never
 * shifts the layout.
 */
export function PopsGallery({ images, title }: { images: Image[]; title: string }) {
  const gallery = images.length ? images : [];
  const [active, setActive] = useState(0);
  const main = gallery[active] ?? gallery[0];
  const ratio = galleryAspectRatio(gallery[0], 4 / 5);

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {/*
        Height is capped against the viewport so a tall photo can't swallow the
        whole screen — the title, price and Add to Bag stay in view on a phone.
        The cap is applied as a max-WIDTH derived from the ratio, so the frame
        keeps the photo's exact shape and centres, instead of letterboxing.
        At `lg` the value is large enough never to bind: the column governs.
      */}
      <div
        className="relative mx-auto w-full [--gal-h:50svh] sm:[--gal-h:66svh] lg:[--gal-h:1200px]"
        style={{ maxWidth: `calc(var(--gal-h) * ${ratio})` }}
      >
        <ShopImage
          image={main}
          universe="pops"
          priority
          fit="contain"
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="w-full rounded-pops border-2 border-pops-black bg-pops-paper shadow-pops"
          style={{ aspectRatio: String(ratio) }}
          label={title}
        />
        <span className="absolute left-4 top-4 -rotate-3 rounded-full border-2 border-pops-black bg-pops-lime px-3 py-1 font-display text-xs font-bold uppercase text-pops-black shadow-pops">
          the fit ✦
        </span>
      </div>

      {gallery.length > 1 && (
        <div className="scrollbar-none flex w-full min-w-0 gap-3 overflow-x-auto pb-1">
          {gallery.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${gallery.length}`}
              aria-pressed={i === active}
              className={cn(
                'relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-pops-black transition-transform sm:h-24 sm:w-24',
                i === active
                  ? 'shadow-pops ring-2 ring-pops-magenta ring-offset-2 ring-offset-pops-paper'
                  : 'opacity-70 hover:-translate-y-0.5 hover:opacity-100',
              )}
            >
              <ShopImage
                image={img}
                universe="pops"
                fit="contain"
                sizes="96px"
                className="h-full w-full bg-pops-paper"
                label={`${i + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
