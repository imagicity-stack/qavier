import Link from 'next/link';
import { LUXE_LIVE, POPS_LIVE, ESSENTIALS_LIVE } from '@/lib/config';

/**
 * The landing hub — a 2×2 grid of Qavier's four worlds. Qavier is always open;
 * Luxe, Pops and Essentials show "Coming Soon" until their env flag is flipped
 * live (see lib/config.ts). Each block links through to its own page.
 */
export function Hub() {
  return (
    <section className="grid min-h-[100dvh] grid-cols-1 md:grid-cols-2 md:grid-rows-2">
      {/* 01 — QAVIER (flagship, always open) — top left */}
      <Link
        href="/qavier"
        className="group relative flex min-h-[50dvh] flex-col justify-between overflow-hidden bg-luxe-cream p-8 text-luxe-noir sm:p-10 md:min-h-0"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-90 transition-transform duration-[1200ms] ease-luxe group-hover:scale-105"
          style={{ backgroundImage: "url('/images/hub-qavier.png')" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-luxe-cream via-luxe-cream/40 to-transparent" />
        <span className="relative font-sans text-[0.65rem] uppercase tracking-luxe text-luxe-stone">
          01 · The Flagship
        </span>
        <div className="relative">
          <h2 className="font-serif text-5xl font-light leading-none sm:text-6xl">Qavier</h2>
          <p className="mt-3 max-w-xs font-sans text-sm text-luxe-charcoal/80">
            The house. Timeless essentials, considered in every seam.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 font-sans text-[0.7rem] uppercase tracking-wider2 text-luxe-noir">
            Enter
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </div>
      </Link>

      {/* 02 — LUXE — top right */}
      <Link
        href="/luxe"
        className="group relative flex min-h-[50dvh] flex-col justify-between overflow-hidden bg-luxe-noir p-8 text-luxe-cream sm:p-10 md:min-h-0"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            backgroundImage:
              'radial-gradient(70% 60% at 80% 20%, rgba(201,169,106,0.22), transparent 70%)',
          }}
        />
        <span className="relative font-sans text-[0.65rem] uppercase tracking-luxe text-luxe-champagne">
          02 · Luxury Redefined
        </span>
        <div className="relative">
          <h2 className="font-serif text-5xl font-light leading-none sm:text-6xl">Luxe</h2>
          <p className="mt-3 max-w-xs font-sans text-sm text-luxe-cream/60">
            The premium line — investment pieces made to outlive the season.
          </p>
          <Status live={LUXE_LIVE} theme="luxe" />
        </div>
      </Link>

      {/* 03 — POPS — bottom left */}
      <Link
        href="/pops"
        className="group relative flex min-h-[50dvh] flex-col justify-between overflow-hidden bg-pops-violet p-8 text-white sm:p-10 md:min-h-0"
      >
        <div className="grain pointer-events-none absolute inset-0 opacity-15 mix-blend-overlay" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-pops-lime/30 blur-3xl transition-transform duration-700 group-hover:scale-125" />
        <span className="relative font-display text-[0.7rem] font-bold uppercase tracking-widest text-pops-lime">
          03 · Loud. Limited. Iconic.
        </span>
        <div className="relative">
          <h2 className="font-display text-5xl font-bold uppercase leading-none drop-shadow-[3px_3px_0_#0E0E12] sm:text-6xl">
            Pops
          </h2>
          <p className="mt-3 max-w-xs font-display text-sm font-bold uppercase text-pops-cream">
            gone before you finish scrolling.
          </p>
          <Status live={POPS_LIVE} theme="pops" />
        </div>
      </Link>

      {/* 04 — ESSENTIALS — bottom right */}
      <Link
        href="/essentials"
        className="group relative flex min-h-[50dvh] flex-col justify-between overflow-hidden bg-[#E5DBCA] p-8 text-luxe-noir sm:p-10 md:min-h-0"
      >
        <div className="pointer-events-none absolute inset-3 border border-luxe-noir/10" />
        <span className="relative font-sans text-[0.65rem] uppercase tracking-luxe text-luxe-stone">
          04 · Everyday Basics
        </span>
        <div className="relative">
          <h2 className="font-sans text-4xl font-semibold uppercase tracking-tight sm:text-5xl">
            Essentials
          </h2>
          <p className="mt-3 max-w-xs font-sans text-sm text-luxe-charcoal/75">
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
        className={`mt-5 inline-flex items-center gap-2 font-sans text-[0.7rem] uppercase tracking-wider2 ${color}`}
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
      className={`mt-5 inline-block border px-3 py-1 font-sans text-[0.6rem] uppercase tracking-wider2 ${chip}`}
    >
      Coming Soon
    </span>
  );
}
