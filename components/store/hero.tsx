import Image from 'next/image';
import Link from 'next/link';

/**
 * The opening banner.
 *
 * The header above it is solid and sticky, so this is a banner rather than a
 * full-screen takeover — a shopper should see the first products without
 * scrolling a whole viewport. The copy sits bottom-left on desktop and
 * centred on phones, where a side-weighted block fights the narrow column.
 *
 * Swap the picture by replacing `public/images/hero.webp`.
 */
export function Hero({ exploreHref = '/shop' }: { exploreHref?: string }) {
  return (
    <section className="relative isolate flex min-h-[66svh] items-end overflow-hidden bg-ink sm:min-h-[76svh]">
      <Image
        src="/images/hero.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Gradient rather than a flat wash: keeps the artwork bright at the top
          and still gives the copy something solid to sit on. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/35 to-ink/10" />

      <div className="relative mx-auto w-full max-w-[90rem] px-5 pb-12 pt-16 sm:px-8 sm:pb-16 sm:pt-24">
        <div className="max-w-2xl text-center sm:text-left">
          <p className="font-display text-[0.65rem] font-bold uppercase tracking-luxe text-mint-300">
            Spring Summer ’26
          </p>
          <h1 className="mt-4 font-display text-[2rem] font-extrabold uppercase leading-[0.98] tracking-[-0.02em] text-paper text-balance sm:text-5xl lg:text-6xl">
            Where simplicity
            <br className="hidden sm:block" /> becomes luxury
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-paper/75 sm:mx-0">
            Considered pieces, cut in small runs and finished by hand. Designed
            and made in India.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start">
            <Link href={exploreHref} className="btn">
              Explore
            </Link>
            <Link href="/collections" className="btn-outline-light">
              Collections
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
