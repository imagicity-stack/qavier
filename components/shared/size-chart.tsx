'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * The house size chart.
 *
 * Measurements are of the garment, laid flat, in inches — centimetres are
 * derived, so there is only ever one set of numbers to keep true.
 */
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'] as const;

export const SIZE_ROWS: { label: string; values: number[] }[] = [
  { label: 'Chest', values: [41, 43, 45, 47, 49, 51] },
  { label: 'Length', values: [27, 27.5, 28, 28.5, 29, 30] },
  { label: 'Shoulder', values: [20, 21, 22, 22.5, 23, 24] },
  { label: 'Sleeve', values: [7.75, 8, 8.5, 9, 9.5, 9.5] },
];

export const SIZE_CHART_TITLE = 'Size Chart';
export const SIZE_CHART_TIP =
  'If you don’t find an exact match, go for the next size. Measurements may vary 1 inch (+ or −).';

const toCm = (inches: number) => Math.round(inches * 2.54 * 10) / 10;

/** The chart, with an inches / cm switch. */
export function SizeChartTable({ className }: { className?: string }) {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-end gap-3">
        {(['in', 'cm'] as const).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setUnit(u)}
            aria-pressed={unit === u}
            className={cn(
              'text-[0.65rem] uppercase tracking-wider2 transition-colors',
              unit === u ? 'text-ink' : 'text-ink/35 hover:text-ink/60',
            )}
          >
            {u === 'in' ? 'Inches' : 'CM'}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[20rem] border-collapse text-left">
          <caption className="sr-only">
            {SIZE_CHART_TITLE} — measurements in {unit === 'in' ? 'inches' : 'centimetres'}
          </caption>
          <thead>
            <tr className="border-y border-line">
              <th scope="col" className="py-3 pr-3 text-[0.62rem] uppercase tracking-wider2 text-ink/50">
                Size
              </th>
              {SIZE_ROWS.map((row) => (
                <th
                  key={row.label}
                  scope="col"
                  className="px-3 py-3 text-right text-[0.62rem] uppercase tracking-wider2 text-ink/50"
                >
                  {row.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZES.map((size, col) => (
              <tr key={size} className="border-b border-line last:border-b-0">
                <th scope="row" className="py-3 pr-3 text-sm font-normal text-ink">
                  {size}
                </th>
                {SIZE_ROWS.map((row) => (
                  <td
                    key={row.label}
                    className="px-3 py-3 text-right text-sm tabular-nums text-ink/60"
                  >
                    {unit === 'in' ? row.values[col] : toCm(row.values[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink/45">{SIZE_CHART_TIP}</p>
    </div>
  );
}

/**
 * Link that opens the chart in a modal, for the product page.
 * Closes on Escape or a backdrop click and holds focus while open.
 */
export function SizeChartDialog({ className }: { className?: string }) {
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
        className={cn(
          'text-[0.65rem] uppercase tracking-wider2 text-ink/50 underline underline-offset-4 transition-colors hover:text-ink',
          className,
        )}
      >
        Size chart
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[150] flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-chart-title"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] w-full max-w-lg overflow-y-auto bg-paper px-6 py-7 sm:px-8"
          >
            <div className="flex items-start justify-between gap-6">
              <h2
                id="size-chart-title"
                className="text-sm uppercase tracking-wider2 text-ink"
              >
                {SIZE_CHART_TITLE}
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close size chart"
                className="-mt-1 shrink-0 p-1 text-ink/40 transition-colors hover:text-ink"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                  <path
                    d="m6 6 12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <SizeChartTable className="mt-6" />
          </div>
        </div>
      )}
    </>
  );
}
