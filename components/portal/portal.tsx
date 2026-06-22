'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

type Side = 'luxe' | 'pops' | null;

export function Portal() {
  const [hovered, setHovered] = useState<Side>(null);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-luxe-noir">
      {/* ===================================================================
          DESKTOP / TABLET  (md and up) — side-by-side panels, hover-to-grow
          =================================================================== */}
      <div className="relative hidden h-full w-full md:block">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-6 sm:px-10"
        >
          <span className="font-sans text-[0.65rem] uppercase tracking-luxe text-white/60">
            Est. MMXXV
          </span>
          <span className="font-sans text-[0.65rem] uppercase tracking-luxe text-white/60">
            Two Worlds · One Name
          </span>
        </motion.div>

        {/* Center wordmark + hint — set in a frosted-glass seam card */}
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center gap-3 overflow-hidden rounded-3xl border border-white/20 bg-white/10 px-12 py-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <motion.h1
              initial={{ letterSpacing: '0.1em' }}
              animate={{ letterSpacing: '0.25em' }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="select-none text-center font-serif text-5xl font-medium text-white lg:text-6xl"
            >
              QAVIER
            </motion.h1>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="font-sans text-xs uppercase tracking-luxe text-white/75"
            >
              Choose your universe
            </motion.span>
          </motion.div>
        </div>

        {/* Panels */}
        <div className="flex h-full w-full flex-row">
          {/* ——— LUXE ——— */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            onMouseEnter={() => setHovered('luxe')}
            onMouseLeave={() => setHovered(null)}
            style={{
              flexGrow: hovered === 'luxe' ? 1.35 : hovered === 'pops' ? 0.65 : 1,
            }}
            className="group relative flex flex-1 basis-1/2 items-center justify-center overflow-hidden transition-[flex-grow] duration-700 ease-luxe"
          >
            {/* Luxe backdrop: hero photography + tonal scrim for legibility */}
            <div className="absolute inset-0 bg-luxe-noir" />
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-luxe group-hover:scale-105"
              style={{ backgroundImage: "url('/images/luxe.png')" }}
            />
            <div className="absolute inset-0 bg-luxe-noir/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-luxe-noir via-transparent to-luxe-noir/30" />

            <Link
              href="/luxe"
              className="relative z-10 flex flex-col items-center gap-6 px-8 text-center"
              aria-label="Enter Qavier Luxe"
            >
              <span className="font-sans text-[0.65rem] uppercase tracking-luxe text-luxe-champagne">
                I · The Maison
              </span>
              <span className="font-serif text-7xl font-light leading-none text-luxe-cream lg:text-8xl">
                Luxe
              </span>
              <p className="max-w-xs font-serif text-lg italic text-luxe-taupe">
                Quiet luxury, considered in every seam.
              </p>
              <span className="mt-2 inline-flex items-center gap-3 border border-luxe-champagne/50 px-7 py-3.5 font-sans text-[0.7rem] uppercase tracking-wider2 text-luxe-cream transition-all duration-500 group-hover:bg-luxe-champagne group-hover:text-luxe-noir">
                Enter the House
                <span aria-hidden>→</span>
              </span>
            </Link>
          </motion.div>

          {/* ——— POPS ——— */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            onMouseEnter={() => setHovered('pops')}
            onMouseLeave={() => setHovered(null)}
            style={{
              flexGrow: hovered === 'pops' ? 1.35 : hovered === 'luxe' ? 0.65 : 1,
            }}
            className="group relative flex flex-1 basis-1/2 items-center justify-center overflow-hidden transition-[flex-grow] duration-700 ease-luxe"
          >
            {/* Pops backdrop: hero photography, punchy + light scrim */}
            <div className="absolute inset-0 bg-pops-purple" />
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundImage: "url('/images/pops.png')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pops-black/60 via-transparent to-pops-black/15" />
            <div className="grain absolute inset-0 opacity-20 mix-blend-overlay" />

            <Link
              href="/pops"
              className="relative z-10 flex flex-col items-center gap-5 px-8 text-center"
              aria-label="Enter Qavier Pops"
            >
              <span className="rounded-full border-2 border-pops-black bg-pops-lime px-3 py-1 font-display text-[0.65rem] font-bold uppercase text-pops-black">
                II · The Drop
              </span>
              <span className="font-display text-7xl font-bold uppercase leading-none text-white drop-shadow-[4px_4px_0_#0E0E12] lg:text-8xl">
                Pops
              </span>
              <p className="max-w-xs font-display text-base font-bold uppercase text-pops-cream">
                loud. limited. literally iconic.
              </p>
              <span className="mt-2 inline-flex items-center gap-3 rounded-full border-2 border-pops-black bg-pops-yellow px-7 py-3.5 font-display text-sm font-bold uppercase text-pops-black shadow-pops transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-pops-lg">
                enter the drop
                <span aria-hidden>✦</span>
              </span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ===================================================================
          MOBILE  (below md) — stacked photo posters, edge-anchored text,
          compact buttons + a small glass wordmark badge on the seam.
          Uses dedicated mobile crops so heads aren't cropped.
          =================================================================== */}
      <div className="relative flex h-full w-full flex-col md:hidden">
        {/* Luxe — top half, content anchored to the top edge */}
        <Link
          href="/luxe"
          aria-label="Enter Qavier Luxe"
          className="relative flex h-1/2 w-full flex-col items-center justify-start overflow-hidden px-6 pt-9 text-center"
        >
          <div className="absolute inset-0 bg-luxe-noir" />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/luxemobile.png')" }}
          />
          {/* darkest at the top where the text sits, clearing toward the seam */}
          <div className="absolute inset-0 bg-gradient-to-b from-luxe-noir/90 via-luxe-noir/30 to-transparent" />

          <div className="relative z-10 flex flex-col items-center gap-2">
            <span className="font-sans text-[0.55rem] uppercase tracking-luxe text-luxe-champagne">
              I · The Maison
            </span>
            <span className="font-serif text-4xl font-light leading-none text-luxe-cream">
              Luxe
            </span>
            <span className="mt-1 inline-flex items-center gap-2 border border-luxe-champagne/60 px-4 py-1.5 font-sans text-[0.55rem] uppercase tracking-wider2 text-luxe-cream">
              Enter the House
              <span aria-hidden>→</span>
            </span>
          </div>
        </Link>

        {/* Pops — bottom half, content anchored to the bottom edge */}
        <Link
          href="/pops"
          aria-label="Enter Qavier Pops"
          className="relative flex h-1/2 w-full flex-col items-center justify-end overflow-hidden px-6 pb-9 text-center"
        >
          <div className="absolute inset-0 bg-pops-purple" />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/popsmobile.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pops-black/85 via-pops-black/20 to-transparent" />
          <div className="grain absolute inset-0 opacity-20 mix-blend-overlay" />

          <div className="relative z-10 flex flex-col items-center gap-2">
            <span className="rounded-full border-2 border-pops-black bg-pops-lime px-2.5 py-0.5 font-display text-[0.55rem] font-bold uppercase text-pops-black">
              II · The Drop
            </span>
            <span className="font-display text-4xl font-bold uppercase leading-none text-white drop-shadow-[3px_3px_0_#0E0E12]">
              Pops
            </span>
            <span className="mt-1 inline-flex items-center gap-2 rounded-full border-2 border-pops-black bg-pops-yellow px-4 py-1.5 font-display text-[0.6rem] font-bold uppercase text-pops-black shadow-pops">
              enter the drop
              <span aria-hidden>✦</span>
            </span>
          </div>
        </Link>

        {/* Compact glass wordmark on the seam */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-30 flex -translate-y-1/2 justify-center px-10">
          <div className="relative flex flex-col items-center gap-1 overflow-hidden rounded-2xl border border-white/20 bg-white/10 px-5 py-2.5 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.85)] backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <h1 className="select-none text-center font-serif text-xl font-medium tracking-[0.2em] text-white">
              QAVIER
            </h1>
            <span className="font-sans text-[0.5rem] uppercase tracking-luxe text-white/75">
              Choose your universe
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
