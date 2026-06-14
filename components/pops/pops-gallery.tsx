'use client';

import { useState } from 'react';
import { ShopImage } from '@/components/shared/shop-image';
import type { Image } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

/**
 * Pops product gallery. A big main image + a row of tappable thumbnails.
 * Works fine even when every image is a branded placeholder (demo mode).
 */
export function PopsGallery({ images, title }: { images: Image[]; title: string }) {
  const gallery = images.length ? images : [];
  const [active, setActive] = useState(0);
  const main = gallery[active] ?? gallery[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <ShopImage
          image={main}
          universe="pops"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="aspect-[4/5] w-full rounded-pops border-2 border-pops-black shadow-pops"
          label={title}
        />
        <span className="absolute left-4 top-4 -rotate-3 rounded-full border-2 border-pops-black bg-pops-lime px-3 py-1 font-display text-xs font-bold uppercase text-pops-black shadow-pops">
          the fit ✦
        </span>
      </div>

      {gallery.length > 1 && (
        <div className="scrollbar-none flex gap-3 overflow-x-auto pb-1">
          {gallery.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${gallery.length}`}
              aria-pressed={i === active}
              className={cn(
                'relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-pops-black transition-transform sm:h-24 sm:w-24',
                i === active
                  ? 'shadow-pops ring-2 ring-pops-magenta ring-offset-2 ring-offset-pops-paper'
                  : 'opacity-70 hover:-translate-y-0.5 hover:opacity-100',
              )}
            >
              <ShopImage
                image={img}
                universe="pops"
                sizes="96px"
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
