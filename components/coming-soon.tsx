import { Logo } from '@/components/logo';
import { LegalLinks } from '@/components/shared/legal-links';

/** Holding page for the whole store, behind NEXT_PUBLIC_QAVIER_STORE. */
export function ComingSoon() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-ink px-6 text-paper">
      <main className="flex flex-1 flex-col items-center justify-center text-center">
        <Logo className="h-7 w-auto text-paper sm:h-9" />
        <p className="mt-7 text-[0.65rem] uppercase tracking-luxe text-paper/50">
          Opening soon
        </p>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/60">
          Considered pieces, made in small runs. The first collection lands shortly.
        </p>
        <form className="mt-10 flex w-full max-w-xs items-center gap-3 border-b border-paper/25 pb-2" action="#">
          <input
            type="email"
            required
            placeholder="Email address"
            aria-label="Email address"
            className="w-full bg-transparent text-sm text-paper placeholder:text-paper/35 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 text-[0.65rem] uppercase tracking-wider2 text-paper/60 transition-colors hover:text-paper"
          >
            Notify me
          </button>
        </form>
      </main>

      <footer className="py-8 text-center">
        <p className="text-xs text-paper/35">
          © {new Date().getFullYear()} Qavier. All rights reserved.
        </p>
        <LegalLinks className="mt-4" />
      </footer>
    </div>
  );
}
