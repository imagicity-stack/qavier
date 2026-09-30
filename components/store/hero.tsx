import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/logo';

/**
 * Full-bleed opening frame: brand artwork, lockup, season line.
 *
 * The artwork is a real <Image> rather than a CSS background so Next can serve
 * it sized and in a modern format — it is the largest thing on the page and the
 * first thing a shopper sees, so it carries `priority`.
 *
 * Swap the picture by replacing `public/images/hero.webp`.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[88svh] items-center justify-center overflow-hidden bg-[#0C231B] sm:min-h-[92svh]">
      <Image
        src="/images/hero.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Just enough scrim to hold the lockup legible over the lighter swirls. */}
      <div className="absolute inset-0 bg-[#0C231B]/35" />

      <div className="relative mx-auto w-full max-w-[90rem] px-5 py-24 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <Logo invert priority className="h-20 sm:h-28" />
          <p className="mt-7 text-[0.65rem] uppercase tracking-luxe text-paper/75 sm:text-xs">
            Spring Summer ’26
          </p>
          <Link
            href="/shop"
            className="mt-9 inline-flex items-center justify-center border border-paper/50 px-11 py-4 text-[0.7rem] uppercase tracking-wider2 text-paper transition-colors duration-300 hover:bg-paper hover:text-ink"
          >
            Explore
          </Link>
        </div>
      </div>
    </section>
  );
}
