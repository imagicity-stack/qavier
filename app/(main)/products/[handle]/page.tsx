import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/shopify';
import { Gallery } from '@/components/store/gallery';
import { Purchase } from '@/components/store/purchase';
import { ProductRail } from '@/components/store/product-rail';
import { SectionHead } from '@/components/store/section-head';
import { SizeChartTable } from '@/components/shared/size-chart';
import { Reveal } from '@/components/shared/reveal';
import {
  FREE_SHIPPING_THRESHOLD,
  DISPATCH_DAYS,
  RETURN_WINDOW_DAYS,
} from '@/lib/shipping';

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
  if (!product) return { title: 'Not found' };
  return {
    title: product.title,
    description: product.tagline ?? product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);
  if (!product) notFound();

  const related = (await getProducts({ first: 12 }))
    .filter((p) => p.handle !== product.handle)
    .slice(0, 8);

  const reassurance = [
    `Free shipping over ₹${FREE_SHIPPING_THRESHOLD.toLocaleString('en-IN')}`,
    `${RETURN_WINDOW_DAYS}-day returns on unworn pieces`,
    `Dispatched in ${DISPATCH_DAYS}`,
  ];

  return (
    <>
      <section className="mx-auto max-w-[90rem] px-5 pb-20 pt-8 sm:px-8 sm:pt-12">
        {/* min-w-0: a grid item defaults to min-width:auto, so wide content
            would stretch a column past the viewport and clip its siblings. */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <Gallery images={product.images} title={product.title} />
          </div>

          {/* Sticky offset clears the 5rem header with a little air. */}
          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            {product.productType && (
              <p className="label">{product.productType}</p>
            )}
            <h1 className="mt-2 font-display text-2xl font-bold leading-tight text-ink sm:text-3xl">
              {product.title}
            </h1>
            {product.tagline && (
              <p className="mt-3 text-sm leading-relaxed text-ink/55">
                {product.tagline}
              </p>
            )}

            <div className="mt-7">
              <Purchase product={product} />
            </div>

            {/* Reassurance — the same numbers the checkout and policies use. */}
            <ul className="mt-8 flex flex-col gap-2.5 rounded-2xl bg-shell p-5">
              {reassurance.map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-xs text-ink/65">
                  <CheckIcon className="mt-px h-4 w-4 shrink-0 text-mint-600" />
                  {line}
                </li>
              ))}
            </ul>

            {/* Product details, straight from Shopify */}
            {product.descriptionHtml && (
              <div className="mt-10 border-t border-line pt-8">
                <h2 className="label">Product details</h2>
                <div
                  className="mt-4 text-sm leading-relaxed text-ink/70 [&_a]:underline [&_li]:mt-1.5 [&_p]:mt-3 [&_p:first-child]:mt-0 [&_strong]:text-ink [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              </div>
            )}

            {/* Care */}
            <div className="mt-10 border-t border-line pt-8">
              <h2 className="label">Wash care</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink/70">
                {product.material ? `${product.material}. ` : ''}
                Cold machine wash inside out, with like colours. Do not bleach.
                Hang to dry in shade. Warm iron on the reverse, never on the print.
              </p>
            </div>

            {/* Measurements */}
            <div className="mt-10 border-t border-line pt-8">
              <h2 className="label">Size chart</h2>
              <SizeChartTable className="mt-4" />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-shell">
          <div className="mx-auto max-w-[90rem] px-5 py-14 sm:px-8 sm:py-20">
            <Reveal>
              <SectionHead
                eyebrow="More to see"
                title="You may also like"
                href="/shop"
                linkLabel="Shop all"
              />
            </Reveal>
            <div className="mt-8 sm:mt-10">
              <ProductRail products={related} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="m5 12.5 4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
