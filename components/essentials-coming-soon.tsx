import Link from 'next/link';
import { Logo } from '@/components/logo';
import { LegalLinks } from '@/components/shared/legal-links';

/** Qavier Essentials holding page — warm, minimal, understated. */
export function EssentialsComingSoon() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-[#EFE7D8] text-luxe-noir">
      <div className="pointer-events-none absolute inset-4 border border-luxe-noir/10 sm:inset-6" />

      <header className="relative z-10 flex items-center justify-between px-5 py-6 sm:px-10">
        <Link href="/" className="flex items-center" aria-label="Qavier worlds">
          <Logo className="h-5 w-auto text-luxe-noir sm:h-6" />
        </Link>
        <span className="rounded-full border border-luxe-noir/25 px-3 py-1 font-sans text-[0.6rem] uppercase tracking-wider2 text-luxe-charcoal">
          Essentials
        </span>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
        <p className="font-sans text-[0.7rem] uppercase tracking-luxe text-[#8a7d5f]">
          Qavier Essentials · Everyday Basics
        </p>
        <h1 className="mt-6 font-sans text-6xl font-semibold uppercase leading-[0.9] tracking-tight sm:text-8xl">
          Coming
          <br />
          Soon
        </h1>
        <p className="mt-7 max-w-md font-sans text-base leading-relaxed text-luxe-charcoal/75">
          The everyday layer — quietly perfect basics, built to repeat — is almost
          here. Join the list to be first to shop the line.
        </p>

        <form
          className="mt-10 flex w-full max-w-md items-end gap-4 border-b border-luxe-noir/25 pb-3"
          action="#"
          aria-label="Notify me when Qavier Essentials opens"
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            aria-label="Your email address"
            className="w-full bg-transparent font-sans text-base text-luxe-noir placeholder:text-luxe-noir/40 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 font-sans text-[0.7rem] uppercase tracking-wider2 text-luxe-noir transition-colors hover:text-[#8a7d5f]"
          >
            Notify Me →
          </button>
        </form>

        <p className="mt-12 font-sans text-sm text-luxe-charcoal/60">In the meantime</p>
        <Link
          href="/qavier"
          className="mt-4 inline-flex items-center gap-2 bg-luxe-noir px-8 py-4 font-sans text-[0.72rem] uppercase tracking-wider2 text-[#EFE7D8] transition-colors hover:bg-luxe-charcoal"
        >
          Enter Qavier →
        </Link>
      </main>

      <footer className="relative z-10 px-5 py-8 text-center sm:px-10">
        <p className="font-sans text-xs text-luxe-charcoal/50">
          © {new Date().getFullYear()} Qavier. All rights reserved.
        </p>
              <LegalLinks tone="light" className="mt-4" />
      </footer>
    </div>
  );
}
