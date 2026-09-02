import Link from 'next/link';
import { Marquee } from '@/components/shared/marquee';
import { Logo } from '@/components/logo';
import { LEGAL_DOCS } from '@/lib/legal';

const COLUMNS = [
  {
    title: 'shop',
    links: [
      { label: 'shop all', href: '/pops/shop' },
      { label: 'drops', href: '/pops/drops' },
      { label: 'new in', href: '/pops/shop' },
    ],
  },
  {
    title: 'help',
    links: [
      { label: 'shipping', href: '/legal/shipping' },
      { label: 'returns', href: '/legal/returns' },
      { label: 'contact', href: '/legal/contact' },
      { label: 'faq', href: '/pops/drops#faq' },
    ],
  },
  {
    title: 'qavier',
    links: [
      { label: 'home', href: '/' },
      { label: 'shop', href: '/shop' },
    ],
  },
];

export function PopsFooter() {
  return (
    <footer className="bg-pops-black text-pops-cream">
      {/* Marquee strip */}
      <div className="border-y-2 border-pops-lime bg-pops-violet py-3 text-pops-black">
        <Marquee>
          {['FREE SHIPPING OVER ₹100', '✦', 'NEW DROPS EVERY FRIDAY', '✦', 'STUDENT DISCOUNT', '✦', 'JOIN THE CLUB', '✦'].map(
            (t, i) => (
              <span
                key={i}
                className="mx-5 font-display text-lg font-bold uppercase tracking-tight text-white"
              >
                {t}
              </span>
            ),
          )}
        </Marquee>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14">
        {/* Newsletter */}
        <div className="rounded-pops border-2 border-pops-lime bg-pops-ink p-5 sm:p-8 lg:p-10">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl font-bold uppercase leading-none text-pops-lime sm:text-3xl lg:text-5xl">
                get on the list
              </h3>
              <p className="mt-3 font-sans text-pops-cream/70">
                early access to drops, secret sales &amp; the occasional meme. no spam, pinky promise.
              </p>
            </div>
            <form className="flex flex-col gap-3 sm:flex-row" action="#" aria-label="Newsletter signup">
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="w-full rounded-full border-2 border-pops-cream bg-transparent px-5 py-3.5 font-display text-sm font-bold text-pops-cream placeholder:text-pops-cream/40 focus:border-pops-lime focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full border-2 border-pops-lime bg-pops-lime px-7 py-3.5 font-display text-sm font-bold uppercase text-pops-black transition-transform hover:-translate-y-0.5"
              >
                let's go ✦
              </button>
            </form>
          </div>
        </div>

        {/* Columns */}
        <div className="mt-12 grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-auto text-pops-cream" />
              <span className="rounded-full bg-pops-magenta px-3 py-1 font-display text-xs font-bold uppercase text-white">
                pops
              </span>
            </div>
            <p className="mt-4 max-w-xs font-sans text-sm text-pops-cream/50">
              loud, limited & a little chaotic. the other half of the house.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-display text-sm font-bold uppercase text-pops-lime">{col.title}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="font-sans text-sm text-pops-cream/70 transition-colors hover:text-pops-magenta"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Every policy, on every page of Pops. */}
        <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 border-t-2 border-pops-cream/10 pt-6">
          {LEGAL_DOCS.map((doc) => (
            <Link
              key={doc.slug}
              href={`/legal/${doc.slug}`}
              className="font-display text-xs font-bold uppercase text-pops-cream/50 transition-colors hover:text-pops-lime"
            >
              {doc.nav}
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 pt-2 text-pops-cream/40 sm:flex-row sm:items-center">
          <p className="font-sans text-xs">© {new Date().getFullYear()} Qavier Pops. don't copy us xx</p>
          <div className="flex gap-2">
            {['ig', 'tt', 'yt', 'x'].map((s) => (
              <span
                key={s}
                className="grid h-8 w-8 place-items-center rounded-full border-2 border-pops-cream/30 font-display text-xs font-bold uppercase"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
