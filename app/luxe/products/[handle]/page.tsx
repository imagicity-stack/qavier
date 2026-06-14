import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/shopify';
import { Reveal } from '@/components/shared/reveal';
import { LuxeGallery } from '@/components/luxe/luxe-gallery';
import { LuxePurchase } from '@/components/luxe/luxe-purchase';
import { LuxeProductCard } from '@/components/luxe/luxe-product-card';

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProduct(params.handle);
  if (!product || product.universe !== 'luxe') {
    return { title: 'Not found' };
  }
  return {
    title: product.title,
    description: product.tagline ?? product.description.slice(0, 160),
  };
}

const DETAILS = (product: {
  material?: string;
}): { summary: string; body: string }[] => [
  {
    summary: 'Materials & Make',
    body: product.material
      ? `${product.material}. Cut and hand-finished in the Qavier atelier, Milan. Each piece passes through a single cutter and a single finisher before it earns the house seal.`
      : 'Cut and hand-finished in the Qavier atelier, Milan. Each piece passes through a single cutter and a single finisher before it earns the house seal.',
  },
  {
    summary: 'Care',
    body: 'Specialist dry-clean only. Rest between wears on a broad wooden hanger, away from direct light. Treated well, this is a piece for the next decade — not the next season.',
  },
  {
    summary: 'Shipping & Returns',
    body: 'Complimentary insured delivery worldwide, presented in Qavier archival packaging. Returns accepted within 30 days, unworn and with the authenticity seal intact.',
  },
];

export default async function Page({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);

  if (!product || product.universe !== 'luxe') {
    notFound();
  }

  const related = (await getProducts({ universe: 'luxe' }))
    .filter((p) => p.handle !== product.handle)
    .slice(0, 4);

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-28 sm:px-10 sm:pt-32 lg:pb-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* —————————————————————————— Gallery —————————————————————————— */}
          <div>
            <LuxeGallery images={product.images} title={product.title} />
          </div>

          {/* —————————————————————————— Info column —————————————————————————— */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2">
              <Link
                href="/luxe"
                className="luxe-label text-luxe-stone transition-colors hover:text-luxe-gold"
              >
                Home
              </Link>
              <span aria-hidden className="text-luxe-stone/50">
                /
              </span>
              <Link
                href="/luxe/collection"
                className="luxe-label text-luxe-stone transition-colors hover:text-luxe-gold"
              >
                Collection
              </Link>
              <span aria-hidden className="text-luxe-stone/50">
                /
              </span>
              <span className="luxe-label text-luxe-charcoal">{product.title}</span>
            </nav>

            {product.badge && (
              <span className="mt-7 inline-block bg-luxe-noir px-3 py-1 font-sans text-[0.6rem] uppercase tracking-wider2 text-luxe-cream">
                {product.badge}
              </span>
            )}

            <h1 className="mt-5 font-serif text-4xl font-light leading-tight text-luxe-noir sm:text-5xl">
              {product.title}
            </h1>

            {product.tagline && (
              <p className="mt-4 font-serif text-xl italic text-luxe-charcoal/70">
                {product.tagline}
              </p>
            )}

            <div className="mt-9">
              <LuxePurchase product={product} />
            </div>

            {/* Description */}
            <div className="mt-12 border-t border-luxe-charcoal/10 pt-8">
              <p className="luxe-label text-luxe-charcoal">The Piece</p>
              <p className="mt-4 font-sans text-base leading-relaxed text-luxe-charcoal/80">
                {product.description}
              </p>
            </div>

            {/* Details accordions */}
            <div className="mt-10 border-t border-luxe-charcoal/10">
              {DETAILS(product).map((row) => (
                <details
                  key={row.summary}
                  className="group border-b border-luxe-charcoal/10"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between py-5 [&::-webkit-details-marker]:hidden">
                    <span className="luxe-label text-luxe-charcoal">{row.summary}</span>
                    <span
                      aria-hidden
                      className="font-serif text-2xl font-light leading-none text-luxe-stone transition-transform duration-300 ease-luxe group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-6 font-sans text-sm leading-relaxed text-luxe-stone">
                    {row.body}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* —————————————————————————— You May Also Like —————————————————————————— */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-10 lg:pb-32">
          <Reveal>
            <div className="flex items-end justify-between">
              <div>
                <p className="luxe-label text-luxe-gold">The Edit</p>
                <h2 className="mt-4 font-serif text-3xl font-light text-luxe-noir sm:text-4xl">
                  You May Also Like
                </h2>
              </div>
              <Link
                href="/luxe/collection"
                className="luxe-label whitespace-nowrap text-luxe-charcoal transition-colors hover:text-luxe-gold"
              >
                View All →
              </Link>
            </div>
            <div className="luxe-rule mt-8" />
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.06}>
                <LuxeProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
