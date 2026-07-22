import Link from 'next/link';

/**
 * Reusable "coming soon" holding page.
 * Used for the pre-launch Qavier Luxe line (`app/luxe/page.tsx`), and available
 * to gate the whole main store via `app/(main)/layout.tsx` when `COMING_SOON`
 * is true (see `lib/config.ts`). Qavier Pops stays live and is offered here as
 * the meantime destination.
 */
export function ComingSoon({
  eyebrow = 'The House of Qavier',
  blurb = 'Our first collection is being finished by hand. Join the list to be first through the door when the doors open.',
}: {
  eyebrow?: string;
  blurb?: string;
} = {}) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-luxe-noir text-luxe-cream">
      {/* Soft editorial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(60% 50% at 50% 0%, rgba(201,169,106,0.18), transparent 70%)',
        }}
      />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-5 py-6 sm:px-10">
        <Link
          href="/"
          className="font-serif text-2xl font-medium tracking-[0.32em] sm:text-3xl"
          aria-label="Back to Qavier"
        >
          QAVIER
        </Link>
        <span className="font-sans text-[0.65rem] uppercase tracking-luxe text-luxe-cream/50">
          Est. MMXXV
        </span>
      </header>

      {/* Center */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
        <p className="luxe-label text-luxe-champagne">{eyebrow}</p>

        <h1 className="mt-6 font-serif text-6xl font-light leading-[1.02] text-balance sm:text-7xl lg:text-8xl">
          Coming Soon
        </h1>

        <p className="mt-7 max-w-md font-sans text-base leading-relaxed text-luxe-cream/70">
          {blurb}
        </p>

        {/* Newsletter (placeholder — wire to your provider when ready) */}
        <form
          className="mt-10 flex w-full max-w-md items-end gap-4 border-b border-luxe-cream/30 pb-3"
          action="#"
          aria-label="Notify me when Qavier opens"
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

        {/* Meanwhile — Pops is live */}
        <p className="font-sans text-sm text-luxe-cream/60">In the meantime</p>
        <Link
          href="/pops"
          className="group mt-4 inline-flex items-center gap-3 rounded-full border-2 border-pops-lime bg-pops-lime px-7 py-3.5 font-display text-sm font-bold uppercase text-pops-black shadow-pops transition-transform hover:-translate-y-0.5"
        >
          Shop Qavier Pops
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            ✦
          </span>
        </Link>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-5 py-8 text-center sm:px-10">
        <p className="font-sans text-xs text-luxe-cream/40">
          © {new Date().getFullYear()} Qavier. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
