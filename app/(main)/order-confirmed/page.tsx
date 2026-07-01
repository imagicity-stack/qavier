import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description:
    'Thank you for your order from Qavier. We have received it and will notify you when it ships.',
};

export default function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const orderId = searchParams.order ?? 'QAVIER-00000';

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-luxe-cream px-6 pb-24 pt-28 text-center text-luxe-noir sm:pt-32">
      {/* Seal */}
      <div className="grid h-20 w-20 place-items-center rounded-full border border-luxe-champagne/60 bg-luxe-porcelain">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-8 w-8 text-luxe-gold"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M8 12.5l2.5 2.5L16 9.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <span className="luxe-label mt-8">Order Received</span>

      <h1 className="mt-4 font-serif text-5xl font-light leading-[1.05] sm:text-6xl">
        Thank You
        <span className="block italic text-luxe-charcoal">for your order!</span>
      </h1>

      <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-luxe-stone">
        We&rsquo;ve received your order and will notify you when it has shipped.
      </p>

      <div className="luxe-rule my-10 max-w-xs" />

      <p className="luxe-label !text-luxe-noir">Order #{orderId}</p>

      <Link href="/shop" className="luxe-btn mt-10">
        Continue Shopping
      </Link>
    </div>
  );
}
