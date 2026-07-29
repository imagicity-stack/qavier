'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/shared/cart-context';
import { ShopImage } from '@/components/shared/shop-image';
import { startCheckout } from '@/lib/actions';
import { formatPrice } from '@/lib/utils';

interface ShippingMethod {
  id: string;
  label: string;
  detail: string;
  cost: number;
}

const SHIPPING_METHODS: ShippingMethod[] = [
  { id: 'standard', label: 'Standard', detail: '5–7 business days', cost: 100 },
  { id: 'express', label: 'Express', detail: '2–4 business days', cost: 250 },
];

export default function LuxeCheckoutPage() {
  const { lines, subtotal, currencyCode, refreshPrices } = useCart();

  // The summary must match what Shopify will charge, so re-price on entry.
  useEffect(() => {
    void refreshPrices();
  }, [refreshPrices]);

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingId, setShippingId] = useState<string>('standard');

  // Contact + address form state.
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
  const shipping =
    SHIPPING_METHODS.find((m) => m.id === shippingId) ?? SHIPPING_METHODS[0];
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
      <div className="min-h-screen bg-luxe-cream px-6 pb-24 pt-28 text-luxe-noir sm:px-10 sm:pt-32">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 py-24 text-center">
          <span className="luxe-label">Checkout</span>
          <h1 className="font-serif text-4xl font-light italic text-luxe-charcoal sm:text-5xl">
            Your bag is empty
          </h1>
          <p className="max-w-md font-sans text-sm leading-relaxed text-luxe-stone">
            There is nothing to check out just yet. Explore the collection and
            add a piece to begin.
          </p>
          <Link href="/shop" className="luxe-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxe-cream px-6 pb-24 pt-28 text-luxe-noir sm:px-10 sm:pt-32">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12">
          <span className="luxe-label">Qavier</span>
          <h1 className="mt-3 font-serif text-5xl font-light leading-none sm:text-6xl">
            Checkout
          </h1>
        </header>

        <form
          onSubmit={handlePlaceOrder}
          className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16"
        >
          {/* ——— Left: form ——— */}
          <div className="space-y-12">
            {/* Contact */}
            <fieldset>
              <legend className="luxe-label mb-5 block">
                Contact Information
              </legend>
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

            <div className="luxe-rule" />

            {/* Shipping address */}
            <fieldset>
              <legend className="luxe-label mb-5 block">Shipping Address</legend>
              <div className="grid gap-5">
                <Field
                  id="fullName"
                  label="Full name"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(v) => update('fullName', v)}
                  required
                />
                <Field
                  id="address"
                  label="Address"
                  autoComplete="address-line1"
                  value={form.address}
                  onChange={(v) => update('address', v)}
                  required
                />
                <Field
                  id="apartment"
                  label="Apartment, suite, etc."
                  optional
                  autoComplete="address-line2"
                  value={form.apartment}
                  onChange={(v) => update('apartment', v)}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    id="city"
                    label="City"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(v) => update('city', v)}
                    required
                  />
                  <Field
                    id="state"
                    label="State"
                    autoComplete="address-level1"
                    value={form.state}
                    onChange={(v) => update('state', v)}
                    required
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    id="pin"
                    label="PIN code"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    value={form.pin}
                    onChange={(v) => update('pin', v)}
                    required
                  />
                  <Field
                    id="phone"
                    label="Phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(v) => update('phone', v)}
                    required
                  />
                </div>
              </div>
            </fieldset>

            <div className="luxe-rule" />

            {/* Shipping method */}
            <fieldset>
              <legend className="luxe-label mb-5 block">Shipping Method</legend>
              <div className="grid gap-4">
                {SHIPPING_METHODS.map((method) => {
                  const selected = shippingId === method.id;
                  return (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-center justify-between border px-5 py-4 transition-colors duration-300 ${
                        selected
                          ? 'border-luxe-noir bg-luxe-porcelain'
                          : 'border-luxe-charcoal/25 hover:border-luxe-charcoal/50'
                      }`}
                    >
                      <span className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="shipping-method"
                          value={method.id}
                          checked={selected}
                          onChange={() => setShippingId(method.id)}
                          className="h-4 w-4 accent-luxe-noir"
                        />
                        <span className="flex flex-col">
                          <span className="font-sans text-sm text-luxe-noir">
                            {method.label}
                          </span>
                          <span className="font-sans text-xs text-luxe-stone">
                            {method.detail}
                          </span>
                        </span>
                      </span>
                      <span className="font-sans text-sm tabular-nums">
                        {formatPrice({
                          amount: method.cost.toFixed(2),
                          currencyCode: currency,
                        })}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          {/* ——— Right: order summary ——— */}
          <aside className="lg:sticky lg:top-32 lg:h-fit">
            <div className="border border-luxe-charcoal/20 bg-luxe-porcelain px-7 py-8">
              <h2 className="luxe-label mb-6">Order Summary</h2>

              <ul className="space-y-5">
                {lines.map((line) => (
                  <li key={line.variantId} className="flex items-start gap-4">
                    <div className="relative h-20 w-16 shrink-0 overflow-hidden">
                      <ShopImage
                        image={line.image}
                        universe="luxe"
                        className="h-full w-full"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="font-serif text-base leading-tight">
                        {line.productTitle}
                      </span>
                      <span className="mt-0.5 font-sans text-xs text-luxe-stone">
                        {line.variantTitle} · Qty {line.quantity}
                      </span>
                    </div>
                    <span className="shrink-0 font-sans text-sm tabular-nums">
                      {formatPrice({
                        amount: (
                          Number(line.price.amount) * line.quantity
                        ).toFixed(2),
                        currencyCode: line.price.currencyCode,
                      })}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="luxe-rule my-6" />

              <dl className="space-y-4 font-sans text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-luxe-charcoal/80">Subtotal</dt>
                  <dd className="tabular-nums">
                    {formatPrice({
                      amount: subtotal.toFixed(2),
                      currencyCode: currency,
                    })}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-luxe-charcoal/80">
                    Shipping{' '}
                    <span className="text-luxe-stone">({shipping.label})</span>
                  </dt>
                  <dd className="tabular-nums">
                    {formatPrice({
                      amount: shipping.cost.toFixed(2),
                      currencyCode: currency,
                    })}
                  </dd>
                </div>
              </dl>

              <div className="luxe-rule my-6" />

              <div className="flex items-baseline justify-between">
                <span className="luxe-label !text-luxe-noir">Total</span>
                <span className="font-serif text-3xl font-light tabular-nums">
                  {formatPrice({
                    amount: total.toFixed(2),
                    currencyCode: currency,
                  })}
                </span>
              </div>

              {error && (
                <p className="mt-6 border border-luxe-champagne/50 bg-luxe-ivory px-4 py-3 text-center font-sans text-xs text-luxe-charcoal">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={placing}
                className={`luxe-btn mt-8 w-full ${placing ? 'opacity-60' : ''}`}
              >
                {placing ? 'Placing Order…' : 'Continue to Payment'}
              </button>

              <p className="mt-4 text-center font-sans text-[0.68rem] leading-relaxed text-luxe-stone">
                You&rsquo;ll complete payment securely on Shopify. Taxes are
                calculated at checkout.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </div>
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
      <label
        htmlFor={id}
        className="mb-2 font-sans text-xs uppercase tracking-wider2 text-luxe-stone"
      >
        {label}
        {optional ? (
          <span className="ml-1 normal-case tracking-normal text-luxe-stone/70">
            (optional)
          </span>
        ) : null}
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
        className="border border-luxe-charcoal/25 bg-transparent px-4 py-3 font-sans text-sm text-luxe-noir transition-colors duration-300 placeholder:text-luxe-stone/60 focus:border-luxe-noir focus:outline-none"
      />
    </div>
  );
}
