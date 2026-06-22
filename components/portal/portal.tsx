'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

type Side = 'luxe' | 'pops' | null;

export function Portal() {
  const [hovered, setHovered] = useState<Side>(null);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-luxe-noir">
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
          className="relative flex flex-col items-center gap-2 overflow-hidden rounded-3xl border border-white/20 bg-white/10 px-8 py-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:gap-3 sm:px-12 sm:py-8"
        >
          {/* soft top highlight to sell the glass */}
          <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <motion.h1
            initial={{ letterSpacing: '0.1em' }}
            animate={{ letterSpacing: '0.25em' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="select-none text-center font-serif text-4xl font-medium text-white sm:text-5xl lg:text-6xl"
          >
            QAVIER
          </motion.h1>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="font-sans text-[0.6rem] uppercase tracking-luxe text-white/75 sm:text-xs"
          >
            Choose your universe
          </motion.span>
        </motion.div>
      </div>

      {/* Panels */}
      <div className="flex h-full w-full flex-col md:flex-row">
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
            <span className="font-serif text-6xl font-light leading-none text-luxe-cream sm:text-7xl lg:text-8xl">
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
            <span className="font-display text-6xl font-bold uppercase leading-none text-white drop-shadow-[4px_4px_0_#0E0E12] sm:text-7xl lg:text-8xl">
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
  );
}
