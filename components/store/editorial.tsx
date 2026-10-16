import Link from 'next/link';
import { ShopImage } from '@/components/shared/shop-image';
import type { Image } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

export interface Editorial {
  title: string;
  body?: string;
  cta: string;
  href: string;
  image: Image | null;
  /** CSS object-position, to keep the subject in frame when cropped. */
  position?: string;
}

/**
 * Two campaign panels side by side (stacked on phones), each with a serif
 * title and a pill over the photograph.
 */
export function SplitBanners({ items }: { items: Editorial[] }) {
  return (
    <section className="grid gap-2.5 px-4 sm:grid-cols-2 sm:px-6 lg:px-10">
      {items.map((item) => (
        <Panel key={item.href + item.title} item={item} className="aspect-[4/5] sm:aspect-[4/5] lg:aspect-[5/6]" />
      ))}
    </section>
  );
}

/** One campaign photograph across the full width of the page. */
export function WideBanner({ item }: { item: Editorial }) {
  return (
    <section className="px-4 sm:px-6 lg:px-10">
      <Panel item={item} className="aspect-[4/5] sm:aspect-[16/7]" wide />
    </section>
  );
}

function Panel({
  item,
  className,
  wide = false,
}: {
  item: Editorial;
  className?: string;
  wide?: boolean;
}) {
  return (
    <Link href={item.href} className={cn('group relative block overflow-hidden bg-shell', className)}>
      <ShopImage
        image={item.image}
        sizes={wide ? '100vw' : '(max-width: 640px) 100vw, 50vw'}
        position={item.position}
        className="absolute inset-0 h-full w-full transition-transform duration-[1200ms] ease-soft group-hover:scale-[1.02]"
        label={item.title}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
      <div className={cn('absolute inset-x-0 bottom-0 p-6 sm:p-8', wide && 'lg:p-12')}>
        <h3 className="font-serif text-[2rem] leading-[1.05] text-paper sm:text-[2.4rem]">
          {item.title}
        </h3>
        {item.body && <p className="mt-2 max-w-sm text-[0.9rem] font-medium text-paper">{item.body}</p>}
        <span className="btn mt-5">{item.cta}</span>
      </div>
    </Link>
  );
}
