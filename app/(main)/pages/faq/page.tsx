import type { Metadata } from 'next';
import Link from 'next/link';
import {
  DISPATCH_DAYS,
  FREE_SHIPPING_THRESHOLD,
  REFUND_DAYS,
  RETURN_WINDOW_DAYS,
  SHIPPING_METHODS,
} from '@/lib/shipping';

export const metadata: Metadata = {
  title: 'FAQs',
  description: 'Answers on orders, shipping, returns and sizing at Qavier.',
};

/**
 * Every number here comes from `lib/shipping.ts` — the file the checkout and
 * the policy pages read — so an answer can never contradict the till.
 */
const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const SECTIONS: { heading: string; items: { q: string; a: React.ReactNode }[] }[] = [
  {
    heading: 'Orders & Shipping',
    items: [
      {
        q: 'How much is shipping?',
        a: (
          <>
            Standard shipping is free on orders over {inr(FREE_SHIPPING_THRESHOLD)}. Below that,{' '}
            {SHIPPING_METHODS.map((m) => `${m.label.toLowerCase()} is ${inr(m.cost)} (${m.detail})`).join(
              ' and ',
            )}
            .
          </>
        ),
      },
      {
        q: 'When will my order ship?',
        a: `Orders are packed and handed to the courier within ${DISPATCH_DAYS}. You’ll get a tracking link by email as soon as it leaves us.`,
      },
      {
        q: 'Can I change or cancel my order?',
        a: (
          <>
            Get in touch as soon as you can via our{' '}
            <Link href="/legal/contact" className="underline underline-offset-4">
              contact page
            </Link>
            . If the order hasn’t been dispatched yet we’ll do our best to change it.
          </>
        ),
      },
    ],
  },
  {
    heading: 'Returns & Exchanges',
    items: [
      {
        q: 'What is your returns policy?',
        a: `You have ${RETURN_WINDOW_DAYS} days from delivery to return unworn pieces with their tags attached.`,
      },
      {
        q: 'How long do refunds take?',
        a: `Once your return reaches us and passes inspection, the refund is issued to your original payment method within ${REFUND_DAYS}.`,
      },
      {
        q: 'Can I exchange for a different size?',
        a: 'Yes — start a return for the piece you have and place a new order for the size you need, so it ships to you straight away.',
      },
    ],
  },
  {
    heading: 'Products & Sizing',
    items: [
      {
        q: 'How do your pieces fit?',
        a: (
          <>
            Most pieces are a regular fit; between sizes, size up for a relaxed look. Every
            measurement is on our{' '}
            <Link href="/pages/size-guide" className="underline underline-offset-4">
              size guide
            </Link>
            .
          </>
        ),
      },
      {
        q: 'How should I wash my Qavier pieces?',
        a: 'Machine wash cold, inside out, with like colours. Dry flat in the shade, and iron on the reverse — never directly on a print.',
      },
      {
        q: 'Where are your clothes made?',
        a: 'Every piece is designed in-house and cut, printed and finished in India, in small runs.',
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
      <h1 className="h-page text-center">Frequently Asked Questions</h1>

      {SECTIONS.map((section) => (
        <section key={section.heading} className="mt-12">
          <h2 className="font-serif text-[1.4rem]">{section.heading}</h2>
          <div className="mt-4 border-t border-line">
            {section.items.map((item) => (
              <details key={item.q} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[0.95rem] font-bold [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span aria-hidden className="text-xl font-normal leading-none group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <div className="pb-5 text-[0.9rem] leading-relaxed text-ink/80">{item.a}</div>
              </details>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-14 text-center">
        <p className="font-serif text-[1.3rem]">Still have a question?</p>
        <Link href="/legal/contact" className="btn-dark mt-5">
          Contact Us
        </Link>
      </div>
    </div>
  );
}
