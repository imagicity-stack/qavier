import Link from 'next/link';

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'Shop All', href: '/shop' },
      { label: 'Collections', href: '/collection' },
      { label: 'Tailoring', href: '/shop?category=tailoring' },
      { label: 'Outerwear', href: '/shop?category=outerwear' },
      { label: 'Dresses', href: '/shop?category=dresses' },
    ],
  },
  {
    title: 'Maison',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Our Story', href: '/about' },
      { label: 'Journal', href: '/journal' },
      { label: 'Sustainability', href: '/about' },
    ],
  },
  {
    title: 'Client Care',
    links: [
      { label: 'Shipping & Returns', href: '/about#care' },
      { label: 'Size Guide', href: '/about#care' },
      { label: 'FAQs', href: '/about#care' },
      { label: 'Contact a Stylist', href: '/about#care' },
    ],
  },
];

export function LuxeFooter() {
  return (
    <footer className="border-t border-luxe-charcoal/10 bg-luxe-noir text-luxe-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        {/* Newsletter */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="luxe-label text-luxe-champagne">The Qavier Correspondence</p>
            <h3 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
              Invitations to private viewings, &amp; the next chapter — before anyone else.
            </h3>
          </div>
          <form className="flex flex-col justify-end gap-4" action="#" aria-label="Newsletter signup">
            <div className="flex items-end gap-4 border-b border-luxe-cream/30 pb-3">
              <input
                type="email"
                required
                placeholder="Your email address"
                className="w-full bg-transparent font-sans text-base text-luxe-cream placeholder:text-luxe-cream/40 focus:outline-none"
              />
              <button type="submit" className="luxe-label shrink-0 text-luxe-champagne hover:text-luxe-cream">
                Subscribe →
              </button>
            </div>
            <p className="font-sans text-xs text-luxe-cream/40">
              By subscribing you agree to the Qavier privacy policy.
            </p>
          </form>
        </div>

        <div className="my-14 h-px w-full bg-luxe-cream/10" />

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="font-serif text-3xl tracking-[0.3em]">QAVIER</span>
            <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-luxe-cream/50">
              Considered fashion — investment pieces made to last.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="luxe-label text-luxe-champagne">{col.title}</p>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="font-sans text-sm text-luxe-cream/70 transition-colors hover:text-luxe-champagne"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-luxe-cream/10 pt-8 text-luxe-cream/40 sm:flex-row sm:items-center">
          <p className="font-sans text-xs">© {new Date().getFullYear()} Qavier. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6 font-sans text-xs">
            <Link href="/about#care" className="hover:text-luxe-cream">Privacy</Link>
            <Link href="/about#care" className="hover:text-luxe-cream">Terms</Link>
            <Link href="/pops" className="hover:text-luxe-champagne">Qavier Pops ⟶</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
