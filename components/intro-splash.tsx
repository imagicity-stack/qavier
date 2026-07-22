'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const REST = ['A', 'V', 'I', 'E', 'R'];

/**
 * First-load intro. A single "Q" appears, the rest of QAVIER assembles around
 * it, then the whole thing lifts away to reveal the store. Shown once per
 * browser session, and skipped entirely for reduced-motion users.
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
    const t = window.setTimeout(() => setVisible(false), 2700);
    return () => window.clearTimeout(t);
  }, []);

  // Lock scroll while the splash is up.
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
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-luxe-noir"
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
                'radial-gradient(50% 40% at 50% 45%, rgba(201,169,106,0.20), transparent 70%)',
            }}
          />

          {/* Wordmark: Q appears first, the rest assembles */}
          <div className="relative flex items-baseline">
            <motion.span
              className="font-serif text-7xl font-medium tracking-[0.15em] text-luxe-cream sm:text-8xl lg:text-9xl"
              initial={{ scale: 0.35, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Q
            </motion.span>
            {REST.map((ch, i) => (
              <motion.span
                key={ch + i}
                className="font-serif text-7xl font-medium tracking-[0.15em] text-luxe-cream sm:text-8xl lg:text-9xl"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {ch}
              </motion.span>
            ))}
          </div>

          <motion.p
            className="mt-6 font-sans text-[0.6rem] uppercase tracking-luxe text-luxe-champagne sm:text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.45, duration: 0.6 }}
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
            transition={{ delay: 1.8, duration: 0.6 }}
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
