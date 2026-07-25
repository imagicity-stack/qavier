'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LOGO_LETTERS, LOGO_VIEWBOX } from './logo-data';

/**
 * First-load intro. The logo's "Q" appears, then the rest of the QAVIER
 * wordmark assembles letter by letter, before the whole thing lifts away to
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
    const t = window.setTimeout(() => setVisible(false), 2800);
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
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-luxe-noir px-8"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -24, transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] } }}
        >
          {/* Soft glow */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1 }}
            style={{
              backgroundImage:
                'radial-gradient(50% 40% at 50% 46%, rgba(201,169,106,0.20), transparent 70%)',
            }}
          />

          {/* Logo wordmark — Q first, then the rest assemble */}
          <svg
            viewBox={LOGO_VIEWBOX}
            className="w-[82%] max-w-2xl text-luxe-cream"
            fill="currentColor"
            role="img"
            aria-label="Qavier"
          >
            {LOGO_LETTERS.map((letter, i) => (
              <motion.g
                key={letter.key}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={i === 0 ? { opacity: 0, scale: 0.35 } : { opacity: 0, scale: 0.7, y: 26 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={
                  i === 0
                    ? { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
                    : { delay: 0.85 + (i - 1) * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                }
              >
                {letter.paths.map((d, j) => (
                  <path key={j} d={d} />
                ))}
              </motion.g>
            ))}
          </svg>

          <motion.p
            className="mt-8 font-sans text-[0.6rem] uppercase tracking-luxe text-luxe-champagne sm:text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.55, duration: 0.6 }}
          >
            Crafted to Define. Designed to Excel.
          </motion.p>

          {/* Enter — skips straight through */}
          <motion.button
            type="button"
            onClick={() => setVisible(false)}
            className="group absolute bottom-12 flex flex-col items-center gap-2 text-luxe-cream/70 transition-colors hover:text-luxe-cream"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9, duration: 0.6 }}
            aria-label="Enter Qavier"
          >
            <span className="font-sans text-[0.6rem] uppercase tracking-luxe">Enter</span>
            <motion.span
              aria-hidden
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="m6 9 6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
