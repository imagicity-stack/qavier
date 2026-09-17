'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LOGO_LETTERS, LOGO_VIEWBOX } from './logo-data';

/**
 * First-load intro. The wordmark assembles letter by letter, then lifts away to
 * reveal the store. Shown once per browser session; skipped for reduced motion.
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
    const t = window.setTimeout(() => setVisible(false), 2400);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink px-8"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] } }}
        >
          <svg
            viewBox={LOGO_VIEWBOX}
            className="w-[76%] max-w-lg text-paper"
            fill="currentColor"
            role="img"
            aria-label="Qavier"
          >
            {LOGO_LETTERS.map((letter, i) => (
              <motion.g
                key={letter.key}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.15 + i * 0.09,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {letter.paths.map((d, j) => (
                  <path key={j} d={d} />
                ))}
              </motion.g>
            ))}
          </svg>

          <motion.p
            className="mt-7 text-[0.6rem] uppercase tracking-luxe text-paper/50 sm:text-[0.65rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.25, duration: 0.7 }}
          >
            Where Simplicity Becomes Luxury
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
