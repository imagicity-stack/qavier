import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/shopify';
import { PopsGallery } from '@/components/pops/pops-gallery';
import { PopsPurchase } from '@/components/pops/pops-purchase';
import { PopsProductCard } from '@/components/pops/pops-product-card';
import { Reveal } from '@/components/shared/reveal';
import { Marquee } from '@/components/shared/marquee';

// Catalogue pages are regenerated at most this often, so Shopify price and
// stock edits reach the storefront without a redeploy. The /api/revalidate
// webhook flushes them immediately when Shopify pushes a change.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProduct(params.handle);
  if (!product || product.universe !== 'pops') {
    return { title: 'Not found' };
  }
  return {
    title: product.title,
    description: product.tagline ?? product.description,
    openGraph: {
      title: `${product.title} — Qavier Pops`,
      description: product.tagline ?? product.description,
    },
  };
}

export default async function Page({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);
  if (!product || product.universe !== 'pops') {
    notFound();
  }

  const all = await getProducts({ section: 'pops' });
  const more = all.filter((p) => p.handle !== product.handle).slice(0, 4);

  // Build a playful "the details" list from whatever editorial fields exist.
  const vibe = product.tags
    .filter((t) => t !== 'pops')
    .map((t) => t.replace(/-/g, ' '));
  const details = [
    product.material ? { k: 'material', v: product.material, bg: 'bg-pops-lime' } : null,
    { k: 'fit', v: 'oversized & unbothered', bg: 'bg-pops-cyan' },
    vibe.length ? { k: 'vibe', v: vibe.join(' · '), bg: 'bg-pops-pink' } : null,
    { k: 'care', v: 'cold wash, hang dry, wear loud', bg: 'bg-pops-yellow' },
  ].filter(Boolean) as { k: string; v: string; bg: string }[];

  return (
    <div className="overflow-hidden">
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-8 sm:pt-28">
        {/* Breadcrumb chips */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2">
          <Link
            href="/pops"
            className="rounded-full border-2 border-pops-black bg-pops-paper px-3 py-1 font-display text-xs font-bold uppercase text-pops-black transition-colors hover:bg-pops-yellow"
          >
            home
          </Link>
          <span aria-hidden className="font-display text-xs font-bold text-pops-black/40">
            /
          </span>
          <Link
            href="/pops/shop"
            className="rounded-full border-2 border-pops-black bg-pops-paper px-3 py-1 font-display text-xs font-bold uppercase text-pops-black transition-colors hover:bg-pops-yellow"
          >
            shop all
          </Link>
          <span aria-hidden className="font-display text-xs font-bold text-pops-black/40">
            /
          </span>
          {/* Truncated so a long name can't push the product below the fold —
              the full title is the <h1> a few lines down anyway. */}
          <span className="max-w-[55vw] truncate rounded-full border-2 border-pops-black bg-pops-lime px-3 py-1 font-display text-xs font-bold uppercase text-pops-black sm:max-w-none">
            {product.title}
          </span>
        </nav>

        {/* Main: gallery + info */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* LEFT — gallery */}
          <Reveal>
            <PopsGallery images={product.images} title={product.title} />
          </Reveal>

          {/* RIGHT — info */}
          <Reveal delay={0.1} className="flex flex-col gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {product.badge && (
                  <span className="-rotate-2 rounded-full border-2 border-pops-black bg-pops-magenta px-3 py-1 font-display text-xs font-bold uppercase text-white shadow-pops">
                    {product.badge}
                  </span>
                )}
                <span className="pops-chip bg-pops-cyan text-pops-black">in the drop ⚡</span>
              </div>
              <h1 className="mt-4 font-display text-3xl font-bold uppercase leading-[0.95] text-pops-black text-balance sm:text-5xl lg:text-7xl">
                {product.title}
              </h1>
              {product.tagline && (
                <p className="mt-3 font-sans text-lg text-pops-black/70">{product.tagline}</p>
              )}
            </div>

            {/* Variant selector + add to bag (client) */}
            <PopsPurchase product={product} />

            {/* Description */}
            <div className="rounded-pops border-2 border-pops-black bg-pops-cream p-5 shadow-pops sm:p-6">
              <h2 className="font-display text-sm font-bold uppercase text-pops-black">
                the lowdown
              </h2>
              <div
                className="prose-sm mt-2 font-sans text-pops-black/80 [&_p]:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>

            {/* "the details" list */}
            <div>
              <h2 className="mb-3 font-display text-sm font-bold uppercase text-pops-black">
                the details
              </h2>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {details.map((d) => (
                  <div
                    key={d.k}
                    className={`rounded-pops border-2 border-pops-black ${d.bg} px-4 py-3 shadow-pops`}
                  >
                    <dt className="font-display text-[0.7rem] font-bold uppercase text-pops-black/60">
                      {d.k}
                    </dt>
                    <dd className="mt-0.5 font-display text-base font-bold uppercase leading-tight text-pops-black">
                      {d.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Hype marquee divider */}
      <div className="mt-16 border-y-2 border-pops-black bg-pops-violet py-3.5 sm:mt-24">
        <Marquee>
          {['MORE HEAT BELOW', '✦', 'LIMITED RUN', '★', 'NO RESTOCKS', '⚡', 'COP IT QUICK', '★'].map(
            (w, i) => (
              <span
                key={i}
                className="mx-3 font-display text-sm font-bold uppercase tracking-tight text-white sm:mx-5 sm:text-xl lg:text-2xl"
              >
                {w}
              </span>
            ),
          )}
        </Marquee>
      </div>

      {/* "more heat" rail */}
      {more.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <Reveal className="mb-8 sm:mb-12">
            <span className="pops-chip bg-pops-lime text-pops-black">★ don&apos;t stop now</span>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-none text-pops-black sm:text-5xl lg:text-6xl">
              you might also slap
            </h2>
          </Reveal>
          <Reveal className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {more.map((p, i) => (
              <PopsProductCard key={p.id} product={p} index={i} />
            ))}
          </Reveal>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/pops/shop" className="pops-btn">
              back to shop all ⟶
            </Link>
            <Link
              href="/pops/drops"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-pops-black bg-pops-paper px-5 py-3 font-display text-sm font-bold uppercase text-pops-black sm:px-7 sm:py-3.5 sm:text-base transition-transform hover:-translate-y-0.5"
            >
              peep the drops ⚡
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
