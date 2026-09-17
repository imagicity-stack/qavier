import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-paper px-6 text-center text-ink">
      <p className="label">Error 404</p>
      <h1 className="font-display text-3xl font-light sm:text-4xl">
        This page has wandered off
      </h1>
      <p className="max-w-sm text-sm leading-relaxed text-ink/50">
        The link may be old, or the piece may have sold out and been retired.
      </p>
      <Link href="/" className="btn mt-4">
        Back to the store
      </Link>
    </div>
  );
}
