import Image from 'next/image';
import type { Image as ShopImageType } from '@/lib/shopify/types';
import { cn } from '@/lib/utils';

/**
 * Renders product/editorial imagery.
 *
 * • If a real `url` exists (i.e. Shopify is connected) → optimized next/image.
 * • Otherwise → a branded, on-theme "photo coming soon" frame so the layout is
 *   fully composed and you can drop photography in later with zero rework.
 */
export function ShopImage({
  image,
  className,
  sizes,
  priority,
  rounded,
  label,
  fit = 'cover',
  style,
}: {
  image?: ShopImageType | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
  rounded?: string;
  /** Short caption shown inside the placeholder, e.g. "Lookbook 01". */
  label?: string;
  /**
   * How the photo fills its frame. `cover` crops to fill — right for grid
   * cards, where a uniform shape matters more than seeing every pixel.
   * `contain` shows the whole photo, letterboxing rather than cropping — use
   * it wherever a shopper is judging the garment, above all the product page.
   */
  fit?: 'cover' | 'contain';
  /** Inline styles for the frame — used to set an aspect ratio from the photo. */
  style?: React.CSSProperties;
}) {
  const isPlaceholder = !image?.url || image.placeholder;

  if (!isPlaceholder && image) {
    return (
      <div className={cn('relative overflow-hidden', rounded, className)} style={style}>
        <Image
          src={image.url}
          alt={image.altText ?? ''}
          fill
          sizes={sizes ?? '(max-width: 768px) 100vw, 50vw'}
          priority={priority}
          className={fit === 'contain' ? 'object-contain' : 'object-cover'}
        />
      </div>
    );
  }

  return (
    <PlaceholderFrame
      className={cn(rounded, className)}
      style={style}
      label={label ?? image?.altText ?? undefined}
    />
  );
}

export function PlaceholderFrame({
  className,
  label,
  style,
}: {
  className?: string;
  label?: string;
  style?: React.CSSProperties;
}) {
  // A quiet, branded stand-in until real photography lands.
  return (
    <div className={cn('photo-frame', className)} style={style}>
      <div className="relative z-10 flex flex-col items-center gap-3 px-4 text-center">
        <CameraIcon className="h-5 w-5 text-ink/25" />
        <span className="text-[0.6rem] uppercase tracking-wider2 text-ink/35">
          Imagery forthcoming
        </span>
        {label ? (
          <span className="max-w-[14rem] text-xs text-ink/30">{label}</span>
        ) : null}
      </div>
    </div>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.2a1 1 0 0 0 .83-.45l.74-1.1A1 1 0 0 1 9.1 4h5.8a1 1 0 0 1 .83.45l.74 1.1a1 1 0 0 0 .83.45h1.2A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-8Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12.5" r="3.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
