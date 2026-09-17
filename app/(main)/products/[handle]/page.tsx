import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/shopify';
import { Gallery } from '@/components/store/gallery';
import { Purchase } from '@/components/store/purchase';
import { ProductCard } from '@/components/store/product-card';
import { SizeChartTable } from '@/components/shared/size-chart';
import { Reveal } from '@/components/shared/reveal';

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

  const related = (await getProducts({ first: 8 }))
    .filter((p) => p.handle !== product.handle)
    .slice(0, 4);

  return (
    <>
      <section className="mx-auto max-w-[90rem] px-5 pb-20 pt-24 sm:px-8 sm:pt-32">
        {/* min-w-0: a grid item defaults to min-width:auto, so wide content
            would stretch a column past the viewport and clip its siblings. */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <Gallery images={product.images} title={product.title} />
          </div>

          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <h1 className="font-display text-2xl font-light leading-tight text-ink sm:text-3xl">
              {product.title}
            </h1>
            {product.tagline && (
              <p className="mt-3 text-sm leading-relaxed text-ink/50">{product.tagline}</p>
            )}

            <div className="mt-7">
              <Purchase product={product} />
            </div>

            {/* Product details, straight from Shopify */}
            {product.descriptionHtml && (
              <div className="mt-12 border-t border-line pt-8">
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
        <section className="mx-auto max-w-[90rem] px-5 pb-24 sm:px-8 sm:pb-32">
          <Reveal className="flex items-end justify-between gap-6 border-t border-line pt-14">
            <h2 className="font-display text-xl font-light text-ink sm:text-2xl">
              You may also like
            </h2>
            <Link
              href="/shop"
              className="shrink-0 text-[0.65rem] uppercase tracking-wider2 text-ink/50 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              View all
            </Link>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
