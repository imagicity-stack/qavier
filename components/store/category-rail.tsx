'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ShopImage } from '@/components/shared/shop-image';
import type { Image } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

export interface CategoryTile {
  title: string;
  href: string;
  image: Image | null;
}

/**
 * A row of square category tiles with bold, underlined caps labels, and a
 * scroll bar underneath showing where in the row you are.
 *
 * It is a native scroll container with snap points, so it swipes on touch,
 * scrolls with a trackpad, and stays accessible without a slider library.
 * The current page's tile is boxed.
 */
export function CategoryRail({
  tiles,
  activeHref,
}: {
  tiles: CategoryTile[];
  activeHref?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ left: 0, width: 1 });

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const width = el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1;
    const max = el.scrollWidth - el.clientWidth;
    const left = max > 0 ? (el.scrollLeft / max) * (1 - width) : 0;
    setThumb({ left, width });
  }, []);

  useEffect(() => {
    sync();
    const el = ref.current;
    if (!el) return;
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      el.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  if (!tiles.length) return null;

  return (
    <div>
      <div
        ref={ref}
        className="scrollbar-none flex snap-x snap-mandatory scroll-pl-4 gap-3 overflow-x-auto px-4 sm:scroll-pl-6 sm:gap-5 sm:px-6 lg:scroll-pl-0 lg:px-0"
      >
        {tiles.map((tile) => {
          const active = tile.href === activeHref;
          return (
            <Link
              key={tile.href + tile.title}
              href={tile.href}
              className="group w-[38%] shrink-0 snap-start sm:w-[24%] lg:w-[calc((100%-6.25rem)/6)]"
            >
              <div
                className={cn(
                  'relative aspect-square overflow-hidden bg-shell',
                  active && 'outline outline-2 -outline-offset-2 outline-ink',
                )}
              >
                <ShopImage
                  image={tile.image}
                  sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 16vw"
                  className={cn(
                    'absolute inset-0 h-full w-full transition-transform duration-700 ease-soft group-hover:scale-[1.03]',
                    active && 'inset-[5px]',
                  )}
                  label={tile.title}
                />
              </div>
              <div className="mt-4 text-center">
                <span className="label inline-block whitespace-nowrap border-b-2 border-ink pb-1.5 text-[0.66rem] sm:text-[0.7rem]">
                  {tile.title}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {thumb.width < 0.999 && (
        <div className="relative mx-4 mt-7 h-[2px] bg-line sm:mx-6 lg:mx-0" aria-hidden>
          <div
            className="absolute inset-y-0 bg-ink transition-[left] duration-150"
            style={{ left: `${thumb.left * 100}%`, width: `${thumb.width * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
