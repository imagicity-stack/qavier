import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * The QAVIER lockup — diamond mark over the wordmark.
 *
 * The artwork is black on transparency, so `invert` flips it to white for dark
 * backgrounds rather than keeping a second file in sync.
 *
 * Size it with `className`, e.g. `className="h-10 w-auto"`. The proportions of
 * the source file are baked into the constants below, which the intro
 * animation also uses to address the two halves separately.
 */
export const LOGO_SRC = '/images/logo.png';
export const LOGO_WIDTH = 228;
export const LOGO_HEIGHT = 213;
/** Where the diamond mark ends and the wordmark begins, as a fraction. */
export const LOGO_SPLIT = 0.775;

export function Logo({
  className,
  invert = false,
  priority,
  title = 'Qavier',
}: {
  className?: string;
  /** For dark backgrounds — flips the black artwork to white. */
  invert?: boolean;
  priority?: boolean;
  title?: string;
}) {
  return (
    <Image
      src={LOGO_SRC}
      alt={title}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={cn('w-auto object-contain', invert && 'invert', className)}
    />
  );
}
