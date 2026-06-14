import { cn } from '@/lib/utils';

/**
 * An infinite horizontal marquee. Renders the children twice so the loop is
 * seamless (the CSS keyframe translates by -50%).
 */
export function Marquee({
  children,
  className,
  reverse,
  fast,
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  fast?: boolean;
}) {
  return (
    <div className={cn('flex w-full overflow-hidden', className)}>
      <div
        className={cn(
          'flex shrink-0 items-center',
          reverse ? 'animate-marquee-rev' : fast ? 'animate-marquee-fast' : 'animate-marquee',
        )}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
