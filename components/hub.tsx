import Link from 'next/link';
import { LUXE_LIVE, POPS_LIVE, ESSENTIALS_LIVE } from '@/lib/config';

/**
 * The landing hub — Qavier's four worlds. Fills exactly one screen: a stacked
 * 4-row grid on mobile (no scrolling) and a 2×2 grid from `md` up. Qavier is
 * always open; Luxe, Pops and Essentials show "Coming Soon" until their env
 * flag is flipped live (see lib/config.ts). Each block links to its own page.
 */
export function Hub() {
  return (
    <section className="grid h-[100dvh] grid-cols-1 grid-rows-4 overflow-hidden md:grid-cols-2 md:grid-rows-2">
      {/* 01 — QAVIER (flagship, always open) — top left */}
      <Link
        href="/qavier"
        className="group relative flex flex-col justify-between overflow-hidden bg-luxe-cream p-5 text-luxe-noir sm:p-8 md:p-10"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-90 transition-transform duration-[1200ms] ease-luxe group-hover:scale-105"
          style={{ backgroundImage: "url('/images/hub-qavier.png')" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-luxe-cream via-luxe-cream/40 to-transparent" />
        <span className="relative font-sans text-[0.6rem] uppercase tracking-luxe text-luxe-stone sm:text-[0.65rem]">
          01 · The Flagship
        </span>
        <div className="relative">
          <h2 className="font-serif text-3xl font-light leading-none md:text-6xl">Qavier</h2>
          <p className="mt-3 hidden max-w-xs font-sans text-sm text-luxe-charcoal/80 md:block">
            The house. Timeless essentials, considered in every seam.
          </p>
          <span className="mt-2.5 inline-flex items-center gap-2 font-sans text-[0.7rem] uppercase tracking-wider2 text-luxe-noir md:mt-5">
            Enter
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </div>
      </Link>

      {/* 02 — LUXE — top right */}
      <Link
        href="/luxe"
        className="group relative flex flex-col justify-between overflow-hidden bg-luxe-noir p-5 text-luxe-cream sm:p-8 md:p-10"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            backgroundImage:
              'radial-gradient(70% 60% at 80% 20%, rgba(201,169,106,0.22), transparent 70%)',
          }}
        />
        <span className="relative font-sans text-[0.6rem] uppercase tracking-luxe text-luxe-champagne sm:text-[0.65rem]">
          02 · Luxury Redefined
        </span>
        <div className="relative">
          <h2 className="font-serif text-3xl font-light leading-none md:text-6xl">Luxe</h2>
          <p className="mt-3 hidden max-w-xs font-sans text-sm text-luxe-cream/60 md:block">
            The premium line — investment pieces made to outlive the season.
          </p>
          <Status live={LUXE_LIVE} theme="luxe" />
        </div>
      </Link>

      {/* 03 — POPS — bottom left */}
      <Link
        href="/pops"
        className="group relative flex flex-col justify-between overflow-hidden bg-pops-violet p-5 text-white sm:p-8 md:p-10"
      >
        <div className="grain pointer-events-none absolute inset-0 opacity-15 mix-blend-overlay" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-pops-lime/30 blur-3xl transition-transform duration-700 group-hover:scale-125" />
        <span className="relative font-display text-[0.65rem] font-bold uppercase tracking-widest text-pops-lime sm:text-[0.7rem]">
          03 · Loud. Limited. Iconic.
        </span>
        <div className="relative">
          <h2 className="font-display text-3xl font-bold uppercase leading-none drop-shadow-[3px_3px_0_#0E0E12] md:text-6xl">
            Pops
          </h2>
          <p className="mt-3 hidden max-w-xs font-display text-sm font-bold uppercase text-pops-cream md:block">
            gone before you finish scrolling.
          </p>
          <Status live={POPS_LIVE} theme="pops" />
        </div>
      </Link>

      {/* 04 — ESSENTIALS — bottom right */}
      <Link
        href="/essentials"
        className="group relative flex flex-col justify-between overflow-hidden bg-[#E5DBCA] p-5 text-luxe-noir sm:p-8 md:p-10"
      >
        <div className="pointer-events-none absolute inset-3 border border-luxe-noir/10" />
        <span className="relative font-sans text-[0.6rem] uppercase tracking-luxe text-luxe-stone sm:text-[0.65rem]">
          04 · Everyday Basics
        </span>
        <div className="relative">
          <h2 className="font-sans text-3xl font-semibold uppercase tracking-tight md:text-5xl">
            Essentials
          </h2>
          <p className="mt-3 hidden max-w-xs font-sans text-sm text-luxe-charcoal/75 md:block">
            The everyday layer. Quietly perfect basics, built to repeat.
          </p>
          <Status live={ESSENTIALS_LIVE} theme="essentials" />
        </div>
      </Link>
    </section>
  );
}

function Status({ live, theme }: { live: boolean; theme: 'luxe' | 'pops' | 'essentials' }) {
  if (live) {
    const color =
      theme === 'pops'
        ? 'text-white'
        : theme === 'luxe'
          ? 'text-luxe-cream'
          : 'text-luxe-noir';
    return (
      <span
        className={`mt-2.5 inline-flex items-center gap-2 font-sans text-[0.7rem] uppercase tracking-wider2 md:mt-5 ${color}`}
      >
        Enter
        <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
      </span>
    );
  }

  const chip =
    theme === 'pops'
      ? 'border-pops-lime/70 text-pops-lime'
      : theme === 'luxe'
        ? 'border-luxe-champagne/50 text-luxe-champagne'
        : 'border-luxe-noir/30 text-luxe-charcoal';

  return (
    <span
      className={`mt-2.5 inline-block border px-3 py-1 font-sans text-[0.6rem] uppercase tracking-wider2 md:mt-5 ${chip}`}
    >
      Coming Soon
    </span>
  );
}
