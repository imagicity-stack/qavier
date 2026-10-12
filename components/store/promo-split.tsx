import Link from 'next/link';
import { ShopImage } from '@/components/shared/shop-image';
import type { Image } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

/**
 * An editorial half-and-half: one photograph, one short pitch, one way in.
 *
 * `flip` puts the picture on the right. On phones the picture always comes
 * first — the image is what stops the scroll.
 */
export function PromoSplit({
  eyebrow,
  title,
  body,
  href,
  cta = 'Shop now',
  image,
  flip = false,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  href: string;
  cta?: string;
  image?: Image | null;
  flip?: boolean;
}) {
  return (
    <section className="mx-auto max-w-[90rem] px-5 py-12 sm:px-8 sm:py-16">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <Link
          href={href}
          className={cn(
            'group block overflow-hidden rounded-3xl bg-shell',
            flip && 'lg:order-2',
          )}
        >
          <ShopImage
            image={image}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-[4/3] w-full transition-transform duration-[1000ms] ease-soft group-hover:scale-[1.04] lg:aspect-[5/4]"
            label={title}
          />
        </Link>

        <div className={cn('min-w-0', flip && 'lg:order-1')}>
          {eyebrow && <p className="label">{eyebrow}</p>}
          <h2 className="h-section mt-3">{title}</h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/60">{body}</p>
          <Link href={href} className="btn-ghost mt-8">
            {cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
