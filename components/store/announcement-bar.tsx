'use client';

import { useEffect, useState } from 'react';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';

/**
 * The accent strip above the header, with a Close link.
 *
 * The threshold is read from the shipping source of truth rather than typed
 * here, so the bar can't promise what the checkout doesn't honour. Closing it
 * holds for the rest of the browser session. It sits above the sticky header
 * in normal flow, so it scrolls away and gives the page its height back.
 */
const MESSAGE = `Free shipping on all orders over ₹${FREE_SHIPPING_THRESHOLD.toLocaleString('en-IN')}+`;
const STORAGE_KEY = 'qavier-announcement-closed';

export function AnnouncementBar() {
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) setClosed(true);
    } catch {
      /* storage unavailable — show the bar */
    }
  }, []);

  if (closed) return null;

  const close = () => {
    setClosed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* storage unavailable — closes for this page view only */
    }
  };

  return (
    // No z-index on purpose. The header below is a z-50 stacking context, so
    // anything it contains — the mobile drawer and its backdrop — is trapped
    // beneath whatever z-index this bar claims.
    <div className="bg-accent text-ink">
      <div className="flex min-h-[2.4rem] items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-10">
        <p className="text-[0.8rem] font-medium leading-snug">{MESSAGE}</p>
        <button
          type="button"
          onClick={close}
          className="shrink-0 text-[0.8rem] font-medium transition-opacity hover:opacity-60"
        >
          Close
        </button>
      </div>
    </div>
  );
}
