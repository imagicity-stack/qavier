import Link from 'next/link';
import { Marquee } from '@/components/shared/marquee';

const TICKER = ['DROPPING SOON', '✦', 'JOIN THE LIST', '✦', 'NO SPAM PINKY PROMISE', '✦', 'STAY TUNED', '✦'];

/** Qavier Pops holding page — loud, neobrutalist, a little chaotic. */
export function PopsComingSoon() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-pops-violet text-white">
      <div className="grain pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay" />
      <div className="pointer-events-none absolute -left-16 top-24 h-56 w-56 rounded-full bg-pops-lime/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 bottom-24 h-64 w-64 rounded-full bg-pops-magenta/40 blur-3xl" />

      {/* Marquee */}
      <div className="relative z-10 border-b-2 border-pops-black bg-pops-lime py-2.5 text-pops-black">
        <Marquee>
          {TICKER.map((t, i) => (
            <span key={i} className="mx-5 font-display text-sm font-bold uppercase tracking-tight">
              {t}
            </span>
          ))}
        </Marquee>
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-10">
        <Link href="/" className="flex items-center gap-2" aria-label="Qavier worlds">
          <span className="font-display text-2xl font-bold uppercase tracking-tight">QAVIER</span>
          <span className="pops-chip bg-pops-lime text-pops-black">pops</span>
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
        <span className="pops-chip -rotate-3 bg-pops-yellow text-pops-black">✦ the drop is loading ✦</span>
        <h1 className="mt-6 font-display text-6xl font-bold uppercase leading-[0.85] text-white drop-shadow-[5px_5px_0_#0E0E12] sm:text-8xl lg:text-9xl">
          Dropping
          <br />
          Soon
        </h1>
        <p className="mt-7 max-w-sm font-display text-base font-bold uppercase text-pops-cream">
          loud, limited &amp; a little chaotic. the first drop is almost here 🫠
        </p>

        <form
          className="mt-9 flex w-full max-w-md items-center gap-2 rounded-full border-2 border-pops-black bg-white/95 py-1.5 pl-5 pr-1.5"
          action="#"
          aria-label="Notify me when Qavier Pops drops"
        >
          <input
            type="email"
            required
            placeholder="your@email.com"
            aria-label="Your email address"
            className="w-full bg-transparent font-display text-sm font-bold text-pops-black placeholder:text-pops-black/40 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full border-2 border-pops-black bg-pops-lime px-5 py-2.5 font-display text-sm font-bold uppercase text-pops-black transition-transform hover:-translate-y-0.5"
          >
            notify me ⚡
          </button>
        </form>

        <p className="mt-10 font-display text-xs font-bold uppercase tracking-widest text-pops-cream/70">
          meanwhile
        </p>
        <Link
          href="/qavier"
          className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-pops-black bg-pops-paper px-7 py-3.5 font-display text-sm font-bold uppercase text-pops-black shadow-pops transition-transform hover:-translate-y-0.5"
        >
          shop qavier →
        </Link>
      </main>

      <footer className="relative z-10 px-5 py-6 text-center sm:px-10">
        <p className="font-display text-xs font-bold uppercase tracking-widest text-pops-cream/50">
          © {new Date().getFullYear()} qavier pops. don&apos;t copy us xx
        </p>
      </footer>
    </div>
  );
}
