'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/shared/cart-context';
import { ShopImage } from '@/components/shared/shop-image';
import { startCheckout } from '@/lib/actions';
import { formatPrice } from '@/lib/utils';
// Shared with the shipping policy page, so the two can never quote
// different prices or timelines.
import { SHIPPING_METHODS } from '@/lib/shipping';

export default function CheckoutPage() {
  const { lines, subtotal, currencyCode, refreshPrices } = useCart();

  // The summary must match what Shopify will charge, so re-price on entry.
  useEffect(() => {
    void refreshPrices();
  }, [refreshPrices]);

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingId, setShippingId] = useState('standard');
  const [form, setForm] = useState({
    email: '',
    fullName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pin: '',
    phone: '',
  });

  const currency = currencyCode || 'INR';
  const shipping = SHIPPING_METHODS.find((m) => m.id === shippingId) ?? SHIPPING_METHODS[0];
  const total = subtotal + shipping.cost;
  const empty = lines.length === 0;

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (empty || placing) return;

    setPlacing(true);
    setError(null);
    try {
      const result = await startCheckout(
        lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })),
      );
      if (result.checkoutUrl) {
        // Hand off to Shopify's hosted, secure checkout.
        window.location.href = result.checkoutUrl;
        return;
      }
      setError(result.error ?? 'Checkout failed. Please try again.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setPlacing(false);
    }
  }

  if (empty) {
    return (
      <section className="mx-auto flex max-w-2xl flex-col items-center gap-7 px-5 pb-24 pt-32 text-center sm:px-8 sm:pt-40">
        <p className="label">Checkout</p>
        <h1 className="font-display text-3xl font-light text-ink">Your bag is empty</h1>
        <p className="max-w-sm text-sm leading-relaxed text-ink/50">
          There is nothing to check out just yet.
        </p>
        <Link href="/shop" className="btn">
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[70rem] px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
      <header className="mb-10">
        <p className="label">Checkout</p>
        <h1 className="mt-4 font-display text-3xl font-light text-ink sm:text-4xl">
          Your details
        </h1>
      </header>

      <form
        onSubmit={handlePlaceOrder}
        className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16"
      >
        <div className="flex flex-col gap-10">
          <fieldset>
            <legend className="label mb-5">Contact</legend>
            <Field
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(v) => update('email', v)}
              required
            />
          </fieldset>

          <fieldset className="border-t border-line pt-10">
            <legend className="label mb-5">Shipping address</legend>
            <div className="grid gap-4">
              <Field id="fullName" label="Full name" autoComplete="name" value={form.fullName} onChange={(v) => update('fullName', v)} required />
              <Field id="address" label="Address" autoComplete="address-line1" value={form.address} onChange={(v) => update('address', v)} required />
              <Field id="apartment" label="Apartment, suite, etc." optional autoComplete="address-line2" value={form.apartment} onChange={(v) => update('apartment', v)} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="city" label="City" autoComplete="address-level2" value={form.city} onChange={(v) => update('city', v)} required />
                <Field id="state" label="State" autoComplete="address-level1" value={form.state} onChange={(v) => update('state', v)} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="pin" label="PIN code" inputMode="numeric" autoComplete="postal-code" value={form.pin} onChange={(v) => update('pin', v)} required />
                <Field id="phone" label="Phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(v) => update('phone', v)} required />
              </div>
            </div>
          </fieldset>

          <fieldset className="border-t border-line pt-10">
            <legend className="label mb-5">Shipping method</legend>
            <div className="grid gap-3">
              {SHIPPING_METHODS.map((method) => {
                const selected = shippingId === method.id;
                return (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center justify-between border px-5 py-4 transition-colors ${
                      selected ? 'border-ink' : 'border-line hover:border-ink/40'
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="shipping-method"
                        value={method.id}
                        checked={selected}
                        onChange={() => setShippingId(method.id)}
                        className="h-3.5 w-3.5 accent-ink"
                      />
                      <span className="flex flex-col">
                        <span className="text-sm text-ink">{method.label}</span>
                        <span className="text-xs text-ink/45">{method.detail}</span>
                      </span>
                    </span>
                    <span className="text-sm tabular-nums text-ink/70">
                      {formatPrice({ amount: method.cost.toFixed(2), currencyCode: currency })}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        <aside className="lg:sticky lg:top-32 lg:h-fit">
          <p className="label">Order summary</p>

          <ul className="mt-5 divide-y divide-line border-y border-line">
            {lines.map((line) => (
              <li key={line.variantId} className="flex items-start gap-4 py-4">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-shell">
                  <ShopImage image={line.image} className="h-full w-full" sizes="64px" label={line.productTitle} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm leading-snug text-ink">{line.productTitle}</span>
                  <span className="mt-0.5 text-xs text-ink/45">
                    {line.variantTitle} · Qty {line.quantity}
                  </span>
                </div>
                <span className="shrink-0 text-sm tabular-nums text-ink/70">
                  {formatPrice({
                    amount: (Number(line.price.amount) * line.quantity).toFixed(2),
                    currencyCode: line.price.currencyCode,
                  })}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-5 flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-ink/60">Subtotal</dt>
              <dd className="tabular-nums">
                {formatPrice({ amount: subtotal.toFixed(2), currencyCode: currency })}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink/60">Shipping</dt>
              <dd className="tabular-nums">
                {formatPrice({ amount: shipping.cost.toFixed(2), currencyCode: currency })}
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
            <span className="label text-ink">Total</span>
            <span className="text-lg tabular-nums text-ink">
              {formatPrice({ amount: total.toFixed(2), currencyCode: currency })}
            </span>
          </div>

          {error && <p className="mt-5 text-xs text-ink/60">{error}</p>}

          <button type="submit" disabled={placing} className={`btn mt-7 w-full ${placing ? 'opacity-60' : ''}`}>
            {placing ? 'One moment…' : 'Continue to payment'}
          </button>
          <p className="mt-4 text-center text-[0.68rem] leading-relaxed text-ink/40">
            You’ll complete payment securely on Shopify.
          </p>
        </aside>
      </form>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  optional = false,
  required = false,
  autoComplete,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  optional?: boolean;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="label mb-2">
        {label}
        {optional ? <span className="ml-1 normal-case tracking-normal">(optional)</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="field"
      />
    </div>
  );
}
