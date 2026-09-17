import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Order confirmed',
  robots: { index: false, follow: false },
};

export default function OrderConfirmedPage() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-6 px-5 pb-24 pt-32 text-center sm:px-8 sm:pt-40">
      <p className="label">Thank you</p>
      <h1 className="font-display text-3xl font-light text-ink sm:text-4xl">
        Your order is confirmed
      </h1>
      <p className="max-w-sm text-sm leading-relaxed text-ink/55">
        A confirmation is on its way to your inbox, with tracking to follow once
        your parcel leaves us.
      </p>
      <Link href="/shop" className="btn mt-4">
        Continue shopping
      </Link>
    </section>
  );
}
