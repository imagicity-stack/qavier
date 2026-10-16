import Link from 'next/link';
import { Logo } from '@/components/logo';
import { collectionHref } from '@/lib/nav';
import type { CollectionSummary } from '@/lib/shopify/types';

/**
 * The footer, in deep forest: the sign-up line and social links on the left,
 * four link columns on the right, and the locale line along the bottom.
 *
 * Shop links point at collections by handle and are dropped when the
 * collection doesn't exist, the same rule the header menu follows — the
 * footer never links to an empty page.
 *
 * ⚠️ The sign-up form has no backend yet — it posts nowhere. Point its
 * `action` at your email provider (Shopify customer form, Klaviyo, Mailchimp)
 * before launch, or remove it.
 */
const SHOP: { label: string; handle: string }[] = [
  { label: 'New Arrivals', handle: 'new-arrivals' },
  { label: 'Best Sellers', handle: 'best-sellers' },
  { label: 'Men', handle: 'men' },
  { label: 'Women', handle: 'women' },
  { label: 'Kids', handle: 'kids' },
  { label: 'Polos', handle: 'mens-polos' },
  { label: 'Tees', handle: 'mens-t-shirts' },
  { label: 'Bottoms', handle: 'mens-bottoms' },
  { label: 'Outerwear', handle: 'mens-outerwear' },
  { label: 'Accessories', handle: 'accessories' },
  { label: 'Gifts', handle: 'gifts' },
];

/** Only accounts that exist. Add the others here as they open. */
const SOCIALS = [{ label: 'Instagram', href: 'https://instagram.com/qavier.in', icon: InstagramIcon }];

export function SiteFooter({
  collections = [],
  typeLinks = [],
  accountHref,
}: {
  collections?: CollectionSummary[];
  /** Product-type links from the menu's Shop department, used when the store has no collections to list. */
  typeLinks?: { label: string; href: string }[];
  accountHref: string;
}) {
  const known = new Set(collections.map((c) => c.handle));
  const fromCollections = SHOP.filter((l) => known.has(l.handle)).map((l) => ({
    label: l.label,
    href: collectionHref(l.handle),
  }));
  const shop = [
    ...(fromCollections.length ? fromCollections : typeLinks.slice(0, 10)),
    { label: 'Shop All', href: '/shop' },
  ];

  const support = [
    { label: 'My Account', href: accountHref },
    { label: 'Contact Us', href: '/legal/contact' },
    { label: 'Shipping & Delivery', href: '/legal/shipping' },
    { label: 'Returns & Exchanges', href: '/legal/returns' },
    { label: 'FAQs', href: '/pages/faq' },
    { label: 'Size Guide', href: '/pages/size-guide' },
  ];

  const about = [
    { label: 'New to Qavier', href: '/about' },
    { label: 'Our Story', href: '/about#story' },
    ...(known.has('golf') ? [{ label: 'The Golf Shop', href: collectionHref('golf') }] : []),
  ];

  const discover = [
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Terms Of Use', href: '/legal/terms' },
    ...(collections.length ? [{ label: 'All Collections', href: '/collections' }] : []),
  ];

  return (
    <footer className="bg-forest text-paper">
      <div className="px-4 pb-8 pt-10 sm:px-6 lg:px-10 lg:pt-8">
        <div className="flex justify-center">
          <Logo invert className="h-12 opacity-90" />
        </div>

        <div className="mt-10 grid gap-12 lg:mt-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
          {/* Sign-up and socials */}
          <div>
            <p className="max-w-[26rem] font-serif text-[1.55rem] leading-[1.05] sm:text-[1.7rem]">
              Join the list and be the first to hear about new drops, events and sales.
            </p>
            <form action="#" className="mt-7 flex max-w-[21rem] rounded-full bg-paper p-0">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="Email Address"
                className="min-w-0 flex-1 rounded-l-full bg-transparent px-5 py-2.5 text-[0.8rem] text-ink placeholder:text-mute focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-[0.85rem] font-bold text-ink transition-colors hover:bg-accent-soft"
              >
                Submit
              </button>
            </form>
            <div className="mt-8 flex items-center gap-5">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`Qavier on ${label}`}
                  className="transition-opacity hover:opacity-70"
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            <FooterColumn heading="Shop" links={shop} />
            <FooterColumn heading="Support" links={support} />
            <FooterColumn heading="About" links={about} />
            <FooterColumn heading="Discover" links={discover} />
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 text-[0.85rem] sm:flex-row sm:items-center sm:justify-between lg:mt-24">
          <span>INR ₹ | English</span>
          <span>© {new Date().getFullYear()} Qavier. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: { href: string; label: string }[];
}) {
  return (
    <nav aria-label={heading} className="min-w-0">
      <p className="font-serif text-[1.15rem]">{heading}</p>
      <ul className="mt-5 flex flex-col gap-[1.15rem]">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="text-[0.85rem] font-medium underline-offset-4 hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" />
    </svg>
  );
}
