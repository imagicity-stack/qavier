import Link from 'next/link';
import { Logo } from '@/components/logo';

/**
 * Full-bleed opening frame: brand image, wordmark, season line.
 *
 * The artwork is a background image so it can be swapped without touching
 * code — drop `hero.jpg` (desktop) and `hero-mobile.jpg` into public/images.
 * Until they exist the gradient stands in, and the wordmark still reads.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[86svh] items-end overflow-hidden bg-ink sm:min-h-[92svh]">
      {/* Artwork */}
      <div
        className="absolute inset-0 bg-cover bg-center sm:hidden"
        style={{ backgroundImage: "url('/images/hero-mobile.jpg')" }}
      />
      <div
        className="absolute inset-0 hidden bg-cover bg-center sm:block"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      />
      {/* Fallback wash, visible until the photography lands, and a scrim that
          keeps the wordmark legible over any image. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#2A2724] via-ink to-[#15130F]" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/40" />

      <div className="relative mx-auto w-full max-w-[90rem] px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="flex flex-col items-center text-center">
          <Logo className="h-7 w-auto text-paper sm:h-11" />
          <p className="mt-5 text-[0.65rem] uppercase tracking-luxe text-paper/70 sm:text-xs">
            Spring Summer ’26
          </p>
          <Link
            href="/shop"
            className="mt-9 inline-flex items-center justify-center border border-paper/50 px-9 py-4 text-[0.7rem] uppercase tracking-wider2 text-paper transition-colors duration-300 hover:bg-paper hover:text-ink"
          >
            Shop the collection
          </Link>
        </div>
      </div>
    </section>
  );
}
