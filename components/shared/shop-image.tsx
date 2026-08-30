import Image from 'next/image';
import type { Image as ShopImageType, Universe } from '@/lib/shopify/types';
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
  universe,
  className,
  sizes,
  priority,
  rounded,
  label,
  fit = 'cover',
  style,
}: {
  image?: ShopImageType | null;
  universe: Universe;
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
      universe={universe}
      className={cn(rounded, className)}
      style={style}
      label={label ?? image?.altText ?? undefined}
    />
  );
}

export function PlaceholderFrame({
  universe,
  className,
  label,
  style,
}: {
  universe: Universe;
  className?: string;
  label?: string;
  style?: React.CSSProperties;
}) {
  if (universe === 'pops') {
    return (
      <div
        className={cn(
          'photo-frame group/ph isolate bg-pops-paper',
          className,
        )}
        style={style}
      >
        {/* playful checkerboard + blobs */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'repeating-conic-gradient(#0E0E12 0% 25%, transparent 0% 50%)',
            backgroundSize: '34px 34px',
          }}
        />
        <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-pops-cyan blur-2xl" />
        <div className="absolute -bottom-8 right-2 h-28 w-28 rounded-full bg-pops-magenta/70 blur-2xl" />
        <div className="relative z-10 flex flex-col items-center gap-2 text-center">
          <span className="pops-chip bg-pops-yellow text-pops-black">
            <CameraIcon className="h-3.5 w-3.5" />
            photo drop soon
          </span>
          {label ? (
            <span className="max-w-[14rem] font-display text-xs font-semibold uppercase text-pops-black/70">
              {label}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  // LUXE placeholder — restrained, editorial.
  return (
    <div
      className={cn(
        'photo-frame isolate bg-gradient-to-br from-luxe-ivory via-luxe-cream to-luxe-porcelain',
        className,
      )}
      style={style}
    >
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 20%, rgba(201,169,106,0.12), transparent 55%)',
        }}
      />
      <div className="absolute inset-3 border border-luxe-champagne/30" />
      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <CameraIcon className="h-6 w-6 text-luxe-champagne" />
        <span className="luxe-label !tracking-luxe text-luxe-stone">Imagery forthcoming</span>
        {label ? (
          <span className="max-w-[16rem] font-serif text-lg italic text-luxe-charcoal/70">
            {label}
          </span>
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
