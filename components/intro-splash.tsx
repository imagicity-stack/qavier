'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LOGO_HEIGHT, LOGO_SPLIT, LOGO_SRC, LOGO_WIDTH } from './logo';

const SEEN_KEY = 'qavier-intro-seen';

/**
 * Runs before the overlay is parsed, so a visitor who has already seen the
 * intro this session — or asked for less motion — never sees a frame of it.
 * Storage can throw (blocked site data, private modes); then the intro plays.
 */
const PRE_PAINT = `try{var r=matchMedia('(prefers-reduced-motion: reduce)').matches,s=false;try{s=!!sessionStorage.getItem('${SEEN_KEY}')}catch(e){}if(r||s)document.documentElement.setAttribute('data-intro-seen','')}catch(e){}`;

/** Server and client both start visible; the browser only learns otherwise after load. */
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Also remembered in memory, so a visitor whose storage is blocked still sees
 * the intro once per page load rather than on every return to the home page.
 */
let seenInMemory = false;

function alreadySeen(): boolean {
  try {
    return seenInMemory || Boolean(sessionStorage.getItem(SEEN_KEY));
  } catch {
    return seenInMemory;
  }
}

function markSeen() {
  seenInMemory = true;
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    /* storage unavailable — the intro simply plays again next time */
  }
}

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
  /** Skipped outright — removed with no exit animation. */
  const [skipped, setSkipped] = useState(false);

  // Decide before paint: on a client-side return to the home page the overlay
  // would otherwise flash for one frame and then fade.
  useBrowserLayoutEffect(() => {
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (alreadySeen() || reduce) setSkipped(true);
  }, []);

  useEffect(() => {
    if (skipped) return;
    // Marked as seen when it finishes, not when it starts: React runs this
    // effect twice in development, and marking it up front made the second
    // run skip the animation.
    const t = window.setTimeout(() => {
      setVisible(false);
      markSeen();
    }, 2600);
    return () => window.clearTimeout(t);
  }, [skipped]);

  const showing = visible && !skipped;

  useEffect(() => {
    document.body.style.overflow = showing ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showing]);

  if (skipped) return null;

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} />
      <AnimatePresence>
        {visible && (
          <motion.div
            className="intro-splash fixed inset-0 z-[200] flex flex-col items-center justify-center bg-forest px-8"
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
              className="mt-8 font-display text-[0.6rem] font-bold uppercase tracking-brand text-accent sm:text-[0.65rem]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.45, duration: 0.8 }}
            >
              Where Simplicity Becomes Luxury
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
