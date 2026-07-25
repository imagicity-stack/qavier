import { LOGO_LETTERS, LOGO_VIEWBOX } from './logo-data';

/**
 * The QAVIER wordmark logo (public/logotext.svg), inlined so it inherits the
 * surrounding text colour via `currentColor`. Size it with `className`, e.g.
 * `className="h-6 w-auto text-luxe-noir"`.
 */
export function Logo({
  className,
  title = 'Qavier',
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={className}
      fill="currentColor"
      role="img"
      aria-label={title}
    >
      {LOGO_LETTERS.flatMap((letter) =>
        letter.paths.map((d, i) => <path key={`${letter.key}-${i}`} d={d} />),
      )}
    </svg>
  );
}
