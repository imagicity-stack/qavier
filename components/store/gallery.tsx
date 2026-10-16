'use client';

import { useEffect, useRef, useState } from 'react';
import { ShopImage } from '@/components/shared/shop-image';
import type { Image } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

/**
 * Product gallery.
 *
 * Desktop: every shot at once, two to a row, so the page scrolls through the
 * photographs while the purchase panel stays put beside them.
 * Phones: a full-width swipe carousel with a dot per shot.
 */
export function Gallery({ images, title }: { images: Image[]; title: string }) {
  const rail = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Back to the first frame whenever the set changes (a new colourway).
  useEffect(() => {
    setIndex(0);
    rail.current?.scrollTo({ left: 0 });
  }, [images]);

  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  if (!images.length) return null;

  return (
    <>
      {/* Phones */}
      <div className="relative lg:hidden">
        <div
          ref={rail}
          onScroll={onScroll}
          className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto"
        >
          {images.map((img, i) => (
            <div key={i} className="w-full shrink-0 snap-start">
              <ShopImage
                image={img}
                priority={i === 0}
                sizes="100vw"
                className="aspect-[3/4] w-full"
                label={title}
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show image ${i + 1} of ${images.length}`}
                onClick={() =>
                  rail.current?.scrollTo({ left: i * rail.current.clientWidth, behavior: 'smooth' })
                }
                className={cn(
                  'h-2 w-2 rounded-full border border-ink transition-colors',
                  i === index ? 'bg-ink' : 'bg-paper',
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden grid-cols-2 gap-1.5 lg:grid">
        {images.map((img, i) => (
          <ShopImage
            key={i}
            image={img}
            priority={i < 2}
            sizes="30vw"
            className={cn('aspect-[3/4] w-full', images.length === 1 && 'col-span-2')}
            label={title}
          />
        ))}
      </div>
    </>
  );
}
