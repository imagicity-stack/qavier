/**
 * The mint signup band.
 *
 * ⚠️ The form has no backend yet — it posts nowhere. Point the `action` at
 * your email provider (Shopify's customer form, Klaviyo, Mailchimp) before
 * launch, or drop the section; a field that silently swallows an address is
 * worse than no field.
 */
export function Newsletter() {
  return (
    <section className="bg-mint-500">
      <div className="mx-auto grid max-w-[90rem] gap-8 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="font-display text-[0.65rem] font-bold uppercase tracking-wider2 text-ink/60">
            The list
          </p>
          <h2 className="mt-3 font-display text-2xl font-extrabold uppercase leading-[1.05] tracking-[-0.015em] text-ink sm:text-3xl lg:text-[2.25rem]">
            First look at every drop
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/70">
            New pieces, restocks and the occasional quiet announcement. No
            noise, and one click to leave.
          </p>
        </div>

        <form className="flex w-full flex-col gap-3 sm:flex-row" action="#">
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="Email address"
            className="w-full rounded-full border border-ink/15 bg-paper px-5 py-3.5 text-sm text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none"
          />
          <button type="submit" className="btn-dark shrink-0">
            Sign up
          </button>
        </form>
      </div>
    </section>
  );
}
