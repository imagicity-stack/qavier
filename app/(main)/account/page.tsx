import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'My Account',
  robots: { index: false, follow: true },
};

/**
 * Where the header's account icon lands until Shopify is connected — once it
 * is, the icon goes straight to Shopify's hosted customer account instead
 * (see ACCOUNT_URL in lib/config). No sign-in form here: there is nothing to
 * sign in to yet, and a form that goes nowhere is worse than none.
 */
const HELP = [
  { label: 'Track or change an order', href: '/legal/contact' },
  { label: 'Start a return', href: '/legal/returns' },
  { label: 'Shipping & delivery', href: '/legal/shipping' },
  { label: 'FAQs', href: '/pages/faq' },
];

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-xl px-5 pb-24 pt-12 text-center sm:pt-16">
      <h1 className="h-page">My Account</h1>
      <p className="mt-4 text-[0.95rem] leading-relaxed text-mute">
        Customer accounts open soon. In the meantime, everything you need for an order is a click
        away.
      </p>
      <ul className="mt-10 border-t border-line text-left">
        {HELP.map((item) => (
          <li key={item.href} className="border-b border-line">
            <Link
              href={item.href}
              className="flex items-center justify-between py-4 text-[0.95rem] hover:underline"
            >
              {item.label}
              <span aria-hidden>→</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/shop" className="btn-dark mt-10">
        Continue Shopping
      </Link>
    </div>
  );
}
