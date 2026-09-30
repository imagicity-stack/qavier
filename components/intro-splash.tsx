'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LOGO_HEIGHT, LOGO_SPLIT, LOGO_SRC, LOGO_WIDTH } from './logo';

/**
 * First-load intro: the diamond settles, then the wordmark rises under it,
 * then the whole thing lifts away to reveal the store.
 *
 * Both halves are the same artwork, clipped — so there is one logo file and the
 * two pieces can never drift out of alignment. Shown once per browser session;
 * skipped for reduced motion.
 */
export function IntroSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem('qavier-intro-seen');
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (seen || reduce) {
      setVisible(false);
      return;
    }
    sessionStorage.setItem('qavier-intro-seen', '1');
    const t = window.setTimeout(() => setVisible(false), 2600);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0C231B] px-8"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] } }}
        >
          <div
            className="relative w-[62%] max-w-[16rem]"
            style={{ aspectRatio: `${LOGO_WIDTH} / ${LOGO_HEIGHT}` }}
          >
            {/* The diamond — settles into place */}
            <motion.img
              src={LOGO_SRC}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-contain invert"
              style={{ clipPath: `inset(0 0 ${(1 - LOGO_SPLIT) * 100}% 0)` }}
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease }}
            />
            {/* The wordmark — rises under it */}
            <motion.img
              src={LOGO_SRC}
              alt="Qavier"
              className="absolute inset-0 h-full w-full object-contain invert"
              style={{ clipPath: `inset(${LOGO_SPLIT * 100}% 0 0 0)` }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.8, ease }}
            />
          </div>

          <motion.p
            className="mt-8 text-[0.6rem] uppercase tracking-luxe text-paper/45 sm:text-[0.65rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.45, duration: 0.8 }}
          >
            Where Simplicity Becomes Luxury
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
