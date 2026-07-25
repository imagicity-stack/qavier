import Link from 'next/link';
import { Logo } from '@/components/logo';

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'T-Shirts', href: '/shop' },
      { label: 'Luxe (Coming Soon)', href: '/luxe' },
      { label: 'Pops', href: '/pops' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: "FAQ's", href: '/about#care' },
      { label: 'Shipping & Delivery', href: '/about#care' },
      { label: 'Returns & Exchanges', href: '/about#care' },
      { label: 'Size Guide', href: '/about#care' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/about' },
      { label: 'Press', href: '/about' },
      { label: 'Contact Us', href: '/about#care' },
    ],
  },
];

const SOCIALS: { label: string; href: string; Icon: (p: { className?: string }) => JSX.Element }[] = [
  { label: 'Instagram', href: '#', Icon: InstagramIcon },
  { label: 'Facebook', href: '#', Icon: FacebookIcon },
  { label: 'YouTube', href: '#', Icon: YouTubeIcon },
  { label: 'Pinterest', href: '#', Icon: PinterestIcon },
];

export function LuxeFooter() {
  return (
    <footer className="border-t border-luxe-charcoal/10 bg-luxe-noir text-luxe-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)_1.6fr] lg:gap-10">
          {/* Brand */}
          <div>
            <Logo className="h-7 w-auto text-luxe-cream" />
            <p className="mt-5 max-w-xs font-sans text-sm leading-relaxed text-luxe-cream/50">
              Qavier is more than fashion. It&rsquo;s a mindset. A lifestyle.
              Built for those who lead.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-luxe-cream/25 text-luxe-cream/70 transition-colors hover:border-luxe-champagne hover:text-luxe-champagne"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
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

          {/* Newsletter */}
          <div>
            <p className="luxe-label text-luxe-champagne">Stay in the Loop</p>
            <p className="mt-5 max-w-xs font-sans text-sm leading-relaxed text-luxe-cream/50">
              Subscribe for exclusive launches and early access.
            </p>
            <form
              className="mt-5 flex items-center gap-2 rounded-full border border-luxe-cream/25 py-1 pl-4 pr-1"
              action="#"
              aria-label="Newsletter signup"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                aria-label="Enter your email"
                className="w-full bg-transparent font-sans text-sm text-luxe-cream placeholder:text-luxe-cream/40 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-luxe-champagne text-luxe-noir transition-transform hover:-translate-y-0.5"
              >
                <SendIcon className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-luxe-cream/10 pt-7 text-luxe-cream/40 sm:flex-row sm:items-center">
          <p className="font-sans text-xs">
            © {new Date().getFullYear()} Qavier. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6 font-sans text-xs">
            <Link href="/about#care" className="hover:text-luxe-cream">Terms &amp; Conditions</Link>
            <Link href="/about#care" className="hover:text-luxe-cream">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ——— Social / send icons ——— */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M14.5 8.5h2V5.7c-.4-.05-1.3-.2-2.3-.2-2.3 0-3.7 1.4-3.7 3.9V11H8v3h2.5v7h3v-7H16l.4-3h-2.9V9.6c0-.8.3-1.1 1-1.1Z"
        fill="currentColor"
      />
    </svg>
  );
}
function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="6" width="18" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="m11 9.5 4 2.5-4 2.5v-5Z" fill="currentColor" />
    </svg>
  );
}
function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 7.5c-2 0-3.3 1.3-3.3 3 0 .9.5 1.9 1.2 2.2.1 0 .2 0 .2-.2l.2-.7c0-.1 0-.2-.1-.3-.3-.3-.4-.7-.4-1.1 0-1.4 1-2.4 2.5-2.4 1.4 0 2.2.8 2.2 2 0 1.5-.7 2.8-1.7 2.8-.6 0-1-.5-.9-1 .2-.7.5-1.4.5-1.9 0-.4-.2-.8-.7-.8-.6 0-1 .6-1 1.4 0 .5.2.9.2.9l-.7 3c-.1.7-.1 1.5 0 2 0 .1.1.1.2.1.7-1 .9-1.7 1-2 .1-.2.3-1 .3-1 .2.4.8.7 1.4.7 1.9 0 3.2-1.7 3.2-4 0-1.7-1.5-3.4-3.8-3.4Z" fill="currentColor" />
    </svg>
  );
}
function SendIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="m5 12 14-7-4 14-3.5-5L5 12Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
