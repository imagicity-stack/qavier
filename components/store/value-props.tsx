import {
  DISPATCH_DAYS,
  FREE_SHIPPING_THRESHOLD,
  RETURN_WINDOW_DAYS,
} from '@/lib/shipping';

/**
 * The reassurance strip under the hero.
 *
 * Every number comes from `lib/shipping.ts`, the same file the checkout and
 * the policy pages read — so the promise on the home page is the promise at
 * the till. Four columns on desktop, two on phones.
 */
const PROPS = [
  {
    icon: TruckIcon,
    title: 'Free shipping',
    body: `On every order over ₹${FREE_SHIPPING_THRESHOLD.toLocaleString('en-IN')}`,
  },
  {
    icon: ReturnIcon,
    title: `${RETURN_WINDOW_DAYS}-day returns`,
    body: 'Unworn, with tags, no questions',
  },
  {
    icon: BoxIcon,
    title: 'Dispatched fast',
    body: `Out the door in ${DISPATCH_DAYS}`,
  },
  {
    icon: StitchIcon,
    title: 'Made in India',
    body: 'Cut and finished in small runs',
  },
];

export function ValueProps() {
  return (
    <section className="border-y border-line bg-shell">
      <div className="mx-auto grid max-w-[90rem] grid-cols-2 gap-x-5 gap-y-8 px-5 py-10 sm:px-8 lg:grid-cols-4 lg:py-12">
        {PROPS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint-100 text-mint-700">
              <Icon className="h-[1.1rem] w-[1.1rem]" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-[0.7rem] font-bold uppercase tracking-wider2 text-ink">
                {title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink/55">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M3 7h10v9H3V7Zm10 3h4l3 3v3h-7v-6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ReturnIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 9h11a5 5 0 0 1 0 10H9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M7.5 5.5 4 9l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3.5 20 7v10l-8 3.5L4 17V7l8-3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M4 7l8 3.5L20 7M12 10.5v10" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function StitchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 12h16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="3 3"
      />
      <path
        d="M9 6.5 12 4l3 2.5M9 17.5 12 20l3-2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
