import Link from 'next/link';
import { Logo } from '@/components/logo';

/** Qavier Luxe holding page — dark, editorial, gold-lit. */
export function LuxeComingSoon() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-luxe-noir text-luxe-cream">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(60% 55% at 50% 8%, rgba(201,169,106,0.22), transparent 70%)',
        }}
      />

      <header className="relative z-10 flex items-center justify-between px-5 py-6 sm:px-10">
        <Link href="/" className="flex items-center" aria-label="Qavier worlds">
          <Logo className="h-5 w-auto text-luxe-cream sm:h-6" />
        </Link>
        <span className="luxe-label text-luxe-champagne">Luxe</span>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
        <p className="luxe-label text-luxe-champagne">Qavier Luxe · Luxury Redefined</p>
        <div className="luxe-rule my-7 w-16 opacity-50" />
        <h1 className="font-serif text-6xl font-light italic leading-[1.02] text-balance sm:text-7xl lg:text-8xl">
          Coming Soon
        </h1>
        <p className="mt-7 max-w-md font-sans text-base leading-relaxed text-luxe-cream/70">
          The premium line — investment pieces in virgin wool, mulberry silk and
          grade-A cashmere — is being finished by hand. Join the list to be first
          through the door.
        </p>

        <form
          className="mt-10 flex w-full max-w-md items-end gap-4 border-b border-luxe-cream/30 pb-3"
          action="#"
          aria-label="Notify me when Qavier Luxe opens"
        >
          <input
            type="email"
            required
            placeholder="Your email address"
            aria-label="Your email address"
            className="w-full bg-transparent font-sans text-base text-luxe-cream placeholder:text-luxe-cream/40 focus:outline-none"
          />
          <button
            type="submit"
            className="luxe-label shrink-0 text-luxe-champagne transition-colors hover:text-luxe-cream"
          >
            Notify Me →
          </button>
        </form>

        <div className="luxe-rule my-12 max-w-xs opacity-40" />
        <p className="font-sans text-sm text-luxe-cream/60">In the meantime</p>
        <Link
          href="/qavier"
          className="group mt-4 inline-flex items-center gap-3 border border-luxe-champagne bg-luxe-champagne px-8 py-4 font-sans text-[0.72rem] uppercase tracking-wider2 text-luxe-noir transition-all duration-500 ease-luxe hover:bg-transparent hover:text-luxe-cream"
        >
          Enter Qavier
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </main>

      <footer className="relative z-10 px-5 py-8 text-center sm:px-10">
        <p className="font-sans text-xs text-luxe-cream/40">
          © {new Date().getFullYear()} Qavier. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
