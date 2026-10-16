import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/shopify';
import { ProductView } from '@/components/store/purchase';
import { ProductTabs } from '@/components/store/product-rail';
import { SizeChartTable } from '@/components/shared/size-chart';
import {
  DISPATCH_DAYS,
  FREE_SHIPPING_THRESHOLD,
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

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: { handle: string };
  searchParams: { color?: string | string[] };
}) {
  const product = await getProduct(params.handle);
  if (!product) notFound();

  const initialColor = typeof searchParams.color === 'string' ? searchParams.color : undefined;

  const hasDescription = Boolean(product.descriptionHtml.trim() || product.description.trim());
  // The house chart measures tops; bottoms and accessories point to the guide.
  const sizes = product.options.find((o) => o.name.trim().toLowerCase() === 'size')?.values ?? [];
  const isTop =
    sizes.length > 1 &&
    !/bottom|pant|jogger|trouser|short|skirt|swim|hat|cap|bag|wallet|sock|belt/i.test(
      product.productType ?? '',
    );

  // Same type first, then everything else — "more like this" before "more".
  const related = (await getProducts({ first: 24, sortKey: 'BEST_SELLING' }))
    .filter((p) => p.handle !== product.handle)
    .sort(
      (a, b) =>
        Number(b.productType === product.productType) - Number(a.productType === product.productType),
    )
    .slice(0, 10);

  return (
    <>
      <nav aria-label="Breadcrumb" className="hidden px-10 py-4 text-[0.8rem] text-mute lg:block">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:underline">
          Shop All
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.title}</span>
      </nav>

      <section className="pb-16 lg:pl-10">
        <ProductView product={product} initialColor={initialColor}>
          <div className="mt-8 border-t border-line">
            {hasDescription && (
              <Fold title="Description" open>
                {product.descriptionHtml.trim() ? (
                  <div
                    className="[&_li]:mt-1.5 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-5"
                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                  />
                ) : (
                  <p>{product.description}</p>
                )}
              </Fold>
            )}

            <Fold title="Details & Care">
              <ul className="list-disc space-y-1.5 pl-5">
                {product.material && <li>{product.material}</li>}
                <li>Machine wash cold, inside out, with like colours</li>
                <li>Do not bleach · Dry flat in shade</li>
                <li>Warm iron on the reverse, never on a print</li>
                <li>Designed and made in India</li>
              </ul>
            </Fold>

            <Fold title="Size & Fit">
              {isTop ? (
                <>
                  <p>Regular fit. If you’re between sizes, size up for a relaxed look.</p>
                  <SizeChartTable className="mt-4" />
                </>
              ) : (
                <p>
                  Measurements for every style are in our{' '}
                  <Link href="/pages/size-guide" className="underline underline-offset-4">
                    size guide
                  </Link>
                  .
                </p>
              )}
            </Fold>

            <Fold title="Shipping & Returns">
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  Free shipping on orders over ₹{FREE_SHIPPING_THRESHOLD.toLocaleString('en-IN')}
                </li>
                <li>Dispatched in {DISPATCH_DAYS}</li>
                <li>{RETURN_WINDOW_DAYS}-day returns on unworn pieces with tags attached</li>
              </ul>
              <p className="mt-3">
                <Link href="/legal/shipping" className="underline underline-offset-4">
                  Shipping policy
                </Link>{' '}
                ·{' '}
                <Link href="/legal/returns" className="underline underline-offset-4">
                  Returns policy
                </Link>
              </p>
            </Fold>
          </div>
        </ProductView>
      </section>

      {related.length > 0 && (
        <div className="border-t border-line">
          <ProductTabs
            title="You May Also Like"
            tabs={[{ label: 'Related', href: '/shop', products: related }]}
          />
        </div>
      )}
    </>
  );
}

/** One fold-out section of the product details. */
function Fold({
  title,
  open = false,
  children,
}: {
  title: string;
  open?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={open} className="group border-b border-line">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[0.95rem] font-bold [&::-webkit-details-marker]:hidden">
        {title}
        <span aria-hidden className="text-xl font-normal leading-none group-open:hidden">
          +
        </span>
        <span aria-hidden className="hidden text-xl font-normal leading-none group-open:inline">
          −
        </span>
      </summary>
      <div className="pb-5 text-[0.9rem] leading-relaxed text-ink/80">{children}</div>
    </details>
  );
}
