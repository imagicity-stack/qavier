import Link from 'next/link';
import { Logo } from '@/components/logo';
import { LEGAL_DOCS } from '@/lib/legal';
import { collectionHref } from '@/lib/nav';
import type { CollectionSummary } from '@/lib/shopify/types';

const ABOUT_LINKS = [
  { href: '/about', label: 'The house' },
  { href: '/about#size-guide', label: 'Size guide' },
  { href: '/legal/contact', label: 'Contact us' },
  { href: '/collections', label: 'All collections' },
];

/**
 * The footer: brand, collections, help, about, then the legal line.
 *
 * The Shop column is the store's real Shopify collections rather than a typed
 * list, so it can't drift out of step with the menu above it.
 */
export function SiteFooter({ collections = [] }: { collections?: CollectionSummary[] }) {
  const shopLinks = [
    { href: '/shop', label: 'All pieces' },
    ...collections.slice(0, 5).map((c) => ({
      href: collectionHref(c.handle),
      label: c.title,
    })),
  ];

  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-[90rem] px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12">
          <div>
            <Logo className="h-11" />
            <p className="mt-5 max-w-[20rem] text-sm leading-relaxed text-ink/55">
              Considered pieces, made in small runs. Designed and made in India.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <Social
                href="https://instagram.com/qavier.in"
                label="Qavier on Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </Social>
              {/* Contact page rather than a mailto: the support address is
                  still a placeholder in lib/legal.ts. */}
              <Social href="/legal/contact" label="Contact Qavier">
                <MailIcon className="h-4 w-4" />
              </Social>
            </div>
          </div>

          <FooterColumn heading="Shop" links={shopLinks} />
          <FooterColumn
            heading="Help"
            links={LEGAL_DOCS.map((doc) => ({
              href: `/legal/${doc.slug}`,
              label: doc.nav,
            }))}
          />
          <FooterColumn heading="The house" links={ABOUT_LINKS} />
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink/45">
            © {new Date().getFullYear()} Qavier. All rights reserved.
          </p>
          <p className="text-xs text-ink/45">
            Secure checkout by Shopify · Designed and made in India
          </p>
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
    <nav>
      <p className="label">{heading}</p>
      <ul className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="text-sm text-ink/60 transition-colors hover:text-mint-600"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const SOCIAL_CLASS =
  'flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink/60 transition-colors hover:border-mint-500 hover:bg-mint-500 hover:text-ink';

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  // Internal routes go through Link so they're client-side navigations.
  if (!href.startsWith('http')) {
    return (
      <Link href={href} aria-label={label} className={SOCIAL_CLASS}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer noopener"
      className={SOCIAL_CLASS}
    >
      {children}
    </a>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="3"
        y="5.5"
        width="18"
        height="13"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m4.5 8 7.5 5 7.5-5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
