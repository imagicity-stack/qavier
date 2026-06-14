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

      {/* Center wordmark + hint */}
      <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 mix-blend-difference">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9, letterSpacing: '0.1em' }}
          animate={{ opacity: 1, scale: 1, letterSpacing: '0.3em' }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="select-none text-center font-serif text-5xl font-medium text-white sm:text-7xl lg:text-8xl"
        >
          QAVIER
        </motion.h1>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="font-sans text-[0.6rem] uppercase tracking-luxe text-white/70 sm:text-xs"
        >
          Choose your universe
        </motion.span>
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
          {/* Luxe backdrop (placeholder for hero photography) */}
          <div className="absolute inset-0 bg-gradient-to-br from-luxe-ink via-luxe-noir to-black" />
          <div
            className="absolute inset-0 opacity-40 transition-opacity duration-700 group-hover:opacity-60"
            style={{
              backgroundImage:
                'radial-gradient(circle at 70% 30%, rgba(201,169,106,0.22), transparent 55%)',
            }}
          />
          {/* photo-drop hint */}
          <span className="absolute left-5 top-20 font-sans text-[0.6rem] uppercase tracking-luxe text-luxe-champagne/40 sm:left-10">
            ◦ hero imagery forthcoming
          </span>

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
          {/* Pops backdrop */}
          <div className="absolute inset-0 bg-gradient-to-br from-pops-magenta via-pops-purple to-pops-blue" />
          <div className="grain absolute inset-0 opacity-25" />
          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-pops-lime blur-2xl animate-floaty" />
          <div className="absolute bottom-12 right-6 h-44 w-44 rounded-full bg-pops-cyan/80 blur-2xl" />
          <span className="absolute right-5 top-20 font-display text-[0.6rem] font-bold uppercase tracking-wide text-white/60 sm:right-10">
            hero pics dropping soon ◦
          </span>

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

      {/* Center seam badge */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-40 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        <div className="grid h-14 w-14 place-items-center rounded-full border border-white/30 bg-luxe-noir/60 font-serif text-xl text-white backdrop-blur">
          Q
        </div>
      </div>
    </div>
  );
}
