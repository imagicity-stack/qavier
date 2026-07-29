'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Size chart for the Qavier flagship store (the `qavier` section only — Pops,
 * Luxe and Essentials have their own fits and are deliberately untouched).
 *
 * Measurements are garment measurements in inches, flat and doubled where
 * relevant, for the oversized tee block.
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

/** The chart itself — a bordered table, styled to the Qavier palette. */
export function SizeChartTable({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[26rem] border-collapse text-center">
          <caption className="sr-only">
            {SIZE_CHART_TITLE} — all measurements in inches
          </caption>
          <thead>
            <tr className="border-b border-luxe-charcoal/15">
              <th
                scope="col"
                className="px-3 py-4 text-left font-sans text-[0.62rem] uppercase tracking-wider2 text-luxe-charcoal"
              >
                Sizes
              </th>
              {SIZES.map((size) => (
                <th
                  scope="col"
                  key={size}
                  className="px-3 py-4 font-sans text-[0.62rem] uppercase tracking-wider2 text-luxe-charcoal"
                >
                  {size}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZE_ROWS.map((row) => (
              <tr
                key={row.label}
                className="border-b border-luxe-charcoal/10 last:border-b-0"
              >
                <th
                  scope="row"
                  className="whitespace-nowrap px-3 py-4 text-left font-sans text-sm font-normal text-luxe-noir"
                >
                  {row.label}
                </th>
                {row.values.map((value, i) => (
                  <td
                    key={SIZES[i]}
                    className="px-3 py-4 font-sans text-sm tabular-nums text-luxe-stone"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-5 font-sans text-xs leading-relaxed text-luxe-stone">
        <span className="text-luxe-gold">Tip:</span> {SIZE_CHART_TIP} All
        measurements are in inches.
      </p>
    </div>
  );
}

/**
 * "Size Guide" link that opens the chart in a modal, for the product page.
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
        className={className}
      >
        Size Guide
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[150] flex items-end justify-center bg-luxe-noir/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-chart-title"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto border border-luxe-champagne/40 bg-luxe-cream px-6 py-7 shadow-luxe sm:px-9 sm:py-9"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="luxe-label text-luxe-gold">Qavier</p>
                <h2
                  id="size-chart-title"
                  className="mt-3 font-serif text-2xl font-light text-luxe-noir sm:text-3xl"
                >
                  {SIZE_CHART_TITLE}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close size guide"
                className="shrink-0 p-1 text-luxe-stone transition-colors duration-300 hover:text-luxe-noir"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
                  <path
                    d="m6 6 12 12M18 6 6 18"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="luxe-rule my-6" />

            <SizeChartTable />
          </div>
        </div>
      )}
    </>
  );
}
