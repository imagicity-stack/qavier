import Image from 'next/image';
import Link from 'next/link';

/**
 * The opening banner: a full-bleed campaign photograph filling the first
 * screen, with a serif headline, one line of copy and a mint pill in the
 * lower left.
 *
 * Swap the picture by replacing `public/images/homescreen.png` (or point
 * `src` at another file).
 */
export function Hero({
  href = '/shop',
  src = '/images/homescreen.png',
}: {
  href?: string;
  src?: string;
}) {
  return (
    <section className="relative isolate flex h-[calc(100svh-6.4rem)] min-h-[34rem] items-end overflow-hidden bg-shell lg:h-[calc(100svh-6.9rem)]">
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[64%_center] sm:object-center"
      />
      {/* A wash from the bottom-left corner, where the copy sits, so it reads
          on any photograph without dimming the faces. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent sm:bg-gradient-to-tr sm:from-black/55 sm:via-transparent" />

      <div className="relative w-full px-5 pb-14 sm:px-10 sm:pb-16 lg:px-16 lg:pb-20">
        <h1 className="font-serif text-[2.6rem] font-normal leading-[1.05] text-paper sm:text-[3.6rem]">
          Made for Easy Days
        </h1>
        <p className="mt-3 text-[0.9rem] font-medium text-paper">Light layers. Clean lines.</p>
        <Link href={href} className="btn mt-7">
          Shop New Arrivals
        </Link>
      </div>
    </section>
  );
}
