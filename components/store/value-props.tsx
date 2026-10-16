import { FREE_SHIPPING_THRESHOLD, RETURN_WINDOW_DAYS } from '@/lib/shipping';

/**
 * The reassurance strip near the foot of the home page.
 *
 * Every number comes from `lib/shipping.ts`, the same file the checkout and
 * the policy pages read — so the promise here is the promise at the till.
 */
const PROPS = [
  {
    icon: TruckIcon,
    title: 'Free Shipping',
    body: `On orders over ₹${FREE_SHIPPING_THRESHOLD.toLocaleString('en-IN')}`,
  },
  {
    icon: ReturnIcon,
    title: 'Easy Returns',
    body: `${RETURN_WINDOW_DAYS} days to change your mind`,
  },
  {
    icon: LockIcon,
    title: 'Secure Checkout',
    body: 'Cards, UPI and wallets via Shopify',
  },
  {
    icon: StitchIcon,
    title: 'Made in India',
    body: 'Cut and finished in small runs',
  },
];

export function ValueProps() {
  return (
    <section className="border-t border-line">
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-10 lg:py-12">
        {PROPS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex flex-col items-center text-center">
            <Icon className="h-7 w-7" />
            <p className="mt-3 font-serif text-[1.05rem]">{title}</p>
            <p className="mt-1 text-[0.8rem] text-mute">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M3 7h10v9H3V7Zm10 3h4l3 3v3h-7v-6Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="17" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function ReturnIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 9h11a5 5 0 0 1 0 10H9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M7.5 5.5 4 9l3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="5" y="10.5" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function StitchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 12h16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="3 3" />
      <path d="M9 6.5 12 4l3 2.5M9 17.5 12 20l3-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
