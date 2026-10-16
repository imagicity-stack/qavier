'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/store/product-card';
import type { Product } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

/**
 * A horizontal product carousel: swipe on touch, arrows on desktop.
 *
 * A real scroll container with CSS snap rather than a transform slider, so it
 * keeps native momentum, keyboard scrolling and accessibility for free, and
 * can't get out of sync with its own index. Arrows disable at each end
 * instead of wrapping — silently jumping back to the start reads as a bug.
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
  }, [sync, products]);

  const nudge = (direction: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.75, behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <div className="relative">
      <div
        ref={ref}
        className="scrollbar-none flex snap-x snap-mandatory scroll-pl-4 gap-2.5 overflow-x-auto px-4 sm:scroll-pl-6 sm:px-6 lg:scroll-pl-10 lg:px-10"
      >
        {products.map((product, i) => (
          <div
            key={product.id}
            className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[calc((100%-0.625rem*3)/4)]"
          >
            <ProductCard
              product={product}
              priority={i < 2}
              sizes="(max-width: 640px) 46vw, (max-width: 1024px) 31vw, 24vw"
            />
          </div>
        ))}
      </div>

      <Arrow side="left" disabled={atStart} onClick={() => nudge(-1)} />
      <Arrow side="right" disabled={atEnd} onClick={() => nudge(1)} />
    </div>
  );
}

/**
 * A rail with a serif heading and tabs that switch between product sets —
 * New Arrivals / Best Sellers on the home page.
 */
export function ProductTabs({
  title,
  tabs,
}: {
  title?: string;
  tabs: { label: string; href: string; products: Product[] }[];
}) {
  const usable = tabs.filter((t) => t.products.length);
  const [active, setActive] = useState(0);
  const tab = usable[Math.min(active, usable.length - 1)];
  if (!tab) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 px-4 sm:px-6 lg:px-10">
        <div>
          {title && <h2 className="h-section">{title}</h2>}
          {usable.length > 1 && (
            <div className="mt-3 flex gap-6" role="tablist">
              {usable.map((t, i) => (
                <button
                  key={t.label}
                  type="button"
                  role="tab"
                  aria-selected={t === tab}
                  onClick={() => setActive(i)}
                  className={cn(
                    'border-b-2 pb-1.5 text-[0.95rem] transition-colors',
                    t === tab ? 'border-ink text-ink' : 'border-transparent text-mute hover:text-ink',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <Link href={tab.href} className="text-[0.9rem] underline underline-offset-4 hover:opacity-60">
          Shop All
        </Link>
      </div>
      <div className="mt-7">
        <ProductRail key={tab.label} products={tab.products} />
      </div>
    </section>
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
        'absolute top-[36%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition-opacity duration-200 lg:flex',
        side === 'left' ? 'left-5' : 'right-5',
        disabled ? 'pointer-events-none opacity-0' : 'hover:bg-ink hover:text-paper',
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
        <path
          d={side === 'left' ? 'm14 6-6 6 6 6' : 'm10 6 6 6-6 6'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
