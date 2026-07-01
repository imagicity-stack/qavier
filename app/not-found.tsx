import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-8 bg-luxe-noir px-6 text-center">
      <span className="font-sans text-[0.7rem] uppercase tracking-luxe text-luxe-champagne">
        Error 404 · This one got away
      </span>
      <h1 className="font-serif text-6xl text-luxe-cream sm:text-8xl">Off the map</h1>
      <p className="max-w-md font-sans text-luxe-taupe">
        This page has wandered off. Head back to Qavier, or drop into Pops.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 border border-luxe-champagne/60 px-8 py-4 font-sans text-[0.72rem] uppercase tracking-wider2 text-luxe-cream transition-all hover:bg-luxe-champagne hover:text-luxe-noir"
        >
          Back to Qavier
        </Link>
        <Link
          href="/pops"
          className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-pops-lime bg-pops-lime px-8 py-4 font-display text-sm font-bold uppercase text-pops-black transition-transform hover:-translate-y-0.5"
        >
          enter pops ✦
        </Link>
      </div>
    </div>
  );
}
