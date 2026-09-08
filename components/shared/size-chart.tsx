'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Universe } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

/**
 * The house size chart, rendered in either skin.
 *
 * One set of measurements serves every world — the garment block is the same,
 * only the styling changes — so a size never has two different meanings across
 * the site. Measurements are of the garment, laid flat, in inches.
 */
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'] as const;

export const SIZE_ROWS: { label: string; values: number[] }[] = [
  { label: 'Chest', values: [41, 43, 45, 47, 49, 51] },
  { label: 'Length', values: [27, 27.5, 28, 28.5, 29, 30] },
  { label: 'Shoulder', values: [20, 21, 22, 22.5, 23, 24] },
  { label: 'Sleeve', values: [7.75, 8, 8.5, 9, 9.5, 9.5] },
];

export const SIZE_CHART_TITLE = 'Oversized T-Shirt Size Chart';
export const SIZE_CHART_TIP =
  'If you don’t find an exact match, go for the next size. Measurements may vary 1 inch (+ or −).';

/** Per-skin classes, so the same markup reads as native in both worlds. */
const SKIN = {
  luxe: {
    headRow: 'border-b border-luxe-charcoal/15',
    headCell:
      'px-3 py-4 font-sans text-[0.62rem] uppercase tracking-wider2 text-luxe-charcoal',
    bodyRow: 'border-b border-luxe-charcoal/10 last:border-b-0',
    rowLabel: 'px-3 py-4 font-sans text-sm font-normal text-luxe-noir',
    cell: 'px-3 py-4 font-sans text-sm tabular-nums text-luxe-stone',
    tip: 'mt-5 font-sans text-xs leading-relaxed text-luxe-stone',
    tipLead: 'text-luxe-gold',
    backdrop: 'bg-luxe-noir/60',
    panel:
      'border border-luxe-champagne/40 bg-luxe-cream px-6 py-7 shadow-luxe sm:px-9 sm:py-9',
    eyebrow: 'luxe-label text-luxe-gold',
    title: 'mt-3 font-serif text-2xl font-light text-luxe-noir sm:text-3xl',
    close: 'text-luxe-stone transition-colors duration-300 hover:text-luxe-noir',
    trigger:
      'luxe-label text-luxe-stone underline-offset-4 transition-colors duration-300 hover:text-luxe-gold hover:underline',
    label: 'Size Guide',
    eyebrowText: 'Qavier',
  },
  pops: {
    headRow: 'border-b-2 border-pops-black',
    headCell:
      'px-2 py-3 font-display text-[0.65rem] font-bold uppercase text-pops-black sm:px-3',
    bodyRow: 'border-b-2 border-pops-black/10 last:border-b-0',
    rowLabel:
      'px-2 py-3 font-display text-sm font-bold uppercase text-pops-black sm:px-3',
    cell: 'px-2 py-3 font-sans text-sm tabular-nums text-pops-black/70 sm:px-3',
    tip: 'mt-4 font-sans text-xs leading-relaxed text-pops-black/70',
    tipLead: 'font-display font-bold uppercase text-pops-magenta',
    backdrop: 'bg-pops-black/70',
    panel:
      'rounded-pops border-2 border-pops-black bg-pops-paper px-5 py-6 shadow-pops-lg sm:px-7 sm:py-7',
    eyebrow:
      'inline-flex items-center gap-1 rounded-full border-2 border-pops-black bg-pops-lime px-2.5 py-0.5 font-display text-[0.65rem] font-bold uppercase text-pops-black',
    title:
      'mt-3 font-display text-xl font-bold uppercase leading-tight text-pops-black sm:text-2xl',
    close: 'text-pops-black/60 transition-colors hover:text-pops-black',
    trigger:
      'rounded-full border-2 border-pops-black bg-pops-paper px-3 py-1 font-display text-[0.65rem] font-bold uppercase text-pops-black transition-transform hover:-translate-y-0.5 hover:bg-pops-yellow',
    label: 'size chart 📏',
    eyebrowText: '📏 the fit',
  },
} as const;

/** The chart itself — a bordered table in the requested skin. */
export function SizeChartTable({
  universe = 'luxe',
  className,
}: {
  universe?: Universe;
  className?: string;
}) {
  const s = SKIN[universe];

  return (
    <div className={className}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[22rem] border-collapse text-center">
          <caption className="sr-only">
            {SIZE_CHART_TITLE} — all measurements in inches
          </caption>
          <thead>
            <tr className={s.headRow}>
              <th scope="col" className={cn(s.headCell, 'text-left')}>
                Sizes
              </th>
              {SIZES.map((size) => (
                <th scope="col" key={size} className={s.headCell}>
                  {size}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZE_ROWS.map((row) => (
              <tr key={row.label} className={s.bodyRow}>
                <th
                  scope="row"
                  className={cn(s.rowLabel, 'whitespace-nowrap text-left')}
                >
                  {row.label}
                </th>
                {row.values.map((value, i) => (
                  <td key={SIZES[i]} className={s.cell}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={s.tip}>
        <span className={s.tipLead}>Tip:</span> {SIZE_CHART_TIP} All measurements
        are in inches.
      </p>
    </div>
  );
}

/**
 * Trigger that opens the chart in a modal, for the product page.
 * Closes on Escape or a backdrop click and holds focus while open.
 */
export function SizeChartDialog({
  universe = 'luxe',
  className,
}: {
  universe?: Universe;
  className?: string;
}) {
  const s = SKIN[universe];
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    openerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={className ?? s.trigger}
      >
        {s.label}
      </button>

      {open && (
        <div
          className={cn(
            'fixed inset-0 z-[150] flex items-end justify-center p-0 backdrop-blur-sm sm:items-center sm:p-6',
            s.backdrop,
          )}
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-chart-title"
            onClick={(e) => e.stopPropagation()}
            className={cn('max-h-[90vh] w-full max-w-xl overflow-y-auto', s.panel)}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className={s.eyebrow}>{s.eyebrowText}</p>
                <h2 id="size-chart-title" className={s.title}>
                  {SIZE_CHART_TITLE}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close size guide"
                className={cn('shrink-0 p-1', s.close)}
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
                  <path
                    d="m6 6 12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div
              className={cn(
                'my-5',
                universe === 'pops'
                  ? 'border-t-2 border-pops-black/10'
                  : 'luxe-rule my-6',
              )}
            />

            <SizeChartTable universe={universe} />
          </div>
        </div>
      )}
    </>
  );
}
