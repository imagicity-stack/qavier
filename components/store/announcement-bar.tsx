'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FREE_SHIPPING_THRESHOLD, RETURN_WINDOW_DAYS } from '@/lib/shipping';

/**
 * The mint strip above the header.
 *
 * Messages are read from the shipping/returns source of truth rather than
 * typed here, so the bar can't promise a threshold the checkout doesn't
 * honour. It sits above the sticky header in normal flow, so it scrolls away
 * and gives the page its height back.
 */
const MESSAGES = [
  `Free shipping on orders over ₹${FREE_SHIPPING_THRESHOLD.toLocaleString('en-IN')}`,
  `${RETURN_WINDOW_DAYS}-day easy returns`,
  'Designed and made in India',
];

export function AnnouncementBar() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // One message, held still, for anyone who asked for less motion.
    if (reduce || MESSAGES.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % MESSAGES.length),
      4200,
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    // No z-index on purpose. The header below is a z-50 stacking context, so
    // anything it contains — the mobile drawer and its backdrop — is trapped
    // beneath whatever z-index this bar claims. Leaving it in normal flow lets
    // the drawer cover it, which is what a full-height drawer should do.
    <div className="bg-mint-500 text-ink">
      <div className="mx-auto flex h-9 max-w-[90rem] items-center justify-center overflow-hidden px-5 sm:px-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={index}
            className="text-center font-display text-[0.65rem] font-bold uppercase tracking-wider2"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {MESSAGES[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
