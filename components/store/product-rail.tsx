'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ProductCard } from '@/components/store/product-card';
import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

/**
 * A horizontal product carousel.
 *
 * Swipe on touch, arrows on desktop. It is a real scroll container with CSS
 * snap rather than a transform-based slider, so it keeps native momentum,
 * keyboard scrolling and accessibility for free, and it cannot get out of
 * sync with its own index.
 *
 * The arrows disable themselves at each end instead of wrapping around — in a
 * product rail, silently jumping back to the first item reads as a bug.
 */
export function ProductRail({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 2);
    // 2px of slack: sub-pixel widths mean scrollLeft rarely hits max exactly.
    setAtEnd(el.scrollLeft >= max - 2);
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

  const nudge = (direction: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    // Scroll by a touch under one viewport, so a card stays half-visible as
    // an affordance that there is more to come.
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <div className="relative">
      {/* scroll-pl-* must match px-*: snap-start aligns a card to the
          container's scroll origin, which ignores padding, so without it the
          rail lands 20px in and the first card sits flush against the edge. */}
      <div
        ref={ref}
        className="scrollbar-none -mx-5 flex snap-x snap-mandatory scroll-pl-5 gap-4 overflow-x-auto px-5 pb-2 sm:gap-6 sm:scroll-pl-8 sm:px-8 lg:mx-0 lg:scroll-pl-0 lg:px-0"
      >
        {products.map((product, i) => (
          <div
            key={product.id}
            className="w-[60%] shrink-0 snap-start sm:w-[38%] lg:w-[calc((100%-4.5rem)/4)]"
          >
            <ProductCard
              product={product}
              priority={i < 2}
              sizes="(max-width: 640px) 60vw, (max-width: 1024px) 38vw, 23vw"
            />
          </div>
        ))}
      </div>

      <Arrow side="left" disabled={atStart} onClick={() => nudge(-1)} />
      <Arrow side="right" disabled={atEnd} onClick={() => nudge(1)} />
    </div>
  );
}

function Arrow({
  side,
  disabled,
  onClick,
}: {
  side: 'left' | 'right';
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === 'left' ? 'Previous products' : 'Next products'}
      className={cn(
        'absolute top-[32%] z-10 hidden h-11 w-11 items-center justify-center rounded-full border border-line bg-paper/95 text-ink shadow-sm backdrop-blur transition-all duration-200 lg:flex',
        side === 'left' ? '-left-5' : '-right-5',
        disabled
          ? 'pointer-events-none opacity-0'
          : 'hover:border-mint-500 hover:bg-mint-500 hover:text-ink',
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
        <path
          d={side === 'left' ? 'm14 6-6 6 6 6' : 'm10 6 6 6-6 6'}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
