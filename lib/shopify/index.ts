/**
 * Qavier ⇄ Shopify Storefront API client.
 *
 * All catalogue data comes straight from Shopify. Until the SHOPIFY_* env vars
 * are set, the product functions return empty results (no demo/placeholder
 * catalogue), so the storefront is production-ready the moment you connect a
 * real store. See the README "Connecting Shopify" and "Sections on Shopify".
 */
import {
  ADD_TO_CART_MUTATION,
  CREATE_CART_MUTATION,
  GET_CART_QUERY,
  GET_COLLECTION_QUERY,
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_PRODUCT_SITEMAP_QUERY,
  GET_VARIANT_PRICES_QUERY,
  REMOVE_FROM_CART_MUTATION,
  UPDATE_CART_MUTATION,
} from './queries';
import type {
  Cart,
  Collection,
  Image,
  Money,
  Product,
  Section,
  Universe,
} from './types';

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-07';

/**
 * How long (seconds) catalogue reads may be served from the Next data cache.
 * Price/stock edits in Shopify land within this window at the latest; the
 * `/api/revalidate` webhook makes them land immediately. Set
 * SHOPIFY_REVALIDATE_SECONDS=0 to always read live (slower, no caching).
 */
const REVALIDATE_SECONDS = (() => {
  const raw = Number(process.env.SHOPIFY_REVALIDATE_SECONDS);
  return Number.isFinite(raw) && raw >= 0 ? raw : 60;
})();

/** True when the Storefront API credentials are present. */
export const isShopifyConfigured = Boolean(DOMAIN && TOKEN);

let warned = false;
function warnNotConfigured() {
  if (warned || process.env.NODE_ENV === 'production') return;
  warned = true;
  // eslint-disable-next-line no-console
  console.warn(
    '[qavier] Shopify is not configured — set SHOPIFY_STORE_DOMAIN and ' +
      'SHOPIFY_STOREFRONT_ACCESS_TOKEN. Product data will be empty until then.',
  );
}

const endpoint = DOMAIN
  ? `https://${DOMAIN.replace(/^https?:\/\//, '')}/api/${API_VERSION}/graphql.json`
  : '';

interface ShopifyFetchOptions {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  /** ISR window in seconds for read queries (ignored when `cache` is set). */
  revalidate?: number;
  tags?: string[];
}

async function shopifyFetch<T>({
  query,
  variables,
  cache,
  revalidate = REVALIDATE_SECONDS,
  tags,
}: ShopifyFetchOptions): Promise<T> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
    // Cart mutations pass cache:'no-store'; reads use ISR so new products,
    // images and variants appear within `revalidate` seconds — no redeploy.
    ...(cache ? { cache } : { next: { revalidate, ...(tags ? { tags } : {}) } }),
  });

  if (!res.ok) {
    const text = await res.text();
    // eslint-disable-next-line no-console
    console.error(`[qavier] Shopify HTTP ${res.status}: ${text}`);
    throw new Error(`Shopify ${res.status}: ${text}`);
  }

  const body = (await res.json()) as { data: T; errors?: { message: string }[] };
  if (body.errors?.length) {
    const msg = body.errors.map((e) => e.message).join('; ');
    // eslint-disable-next-line no-console
    console.error(`[qavier] Shopify GraphQL error: ${msg}`);
    throw new Error(msg);
  }
  return body.data;
}

// ————————————————————————————————————————————————————————————————
//  Reshaping helpers — flatten Shopify's edge/node connections
// ————————————————————————————————————————————————————————————————
type Edges<T> = { edges: { node: T }[] };
const flatten = <T,>(c?: Edges<T>): T[] => c?.edges?.map((e) => e.node) ?? [];

function deriveUniverse(tags: string[]): Universe {
  return tags.map((t) => t.toLowerCase()).includes('pops') ? 'pops' : 'luxe';
}

function normalizeImage(img: any, alt: string): Image {
  if (!img?.url) {
    return { url: '', altText: alt, placeholder: true, width: 1200, height: 1600 };
  }
  return {
    url: img.url,
    altText: img.altText ?? alt,
    width: img.width,
    height: img.height,
  };
}

function normalizeMoney(m: any): Money | null {
  if (!m || m.amount == null) return null;
  const amount = Number(m.amount);
  if (!Number.isFinite(amount)) return null;
  return { amount: String(m.amount), currencyCode: m.currencyCode };
}

/**
 * Compare-at ("was") prices. Shopify reports `0.0` rather than null when no
 * compare-at price is set, which would otherwise render a struck-through zero,
 * so anything at or below zero is treated as "not on sale".
 */
function normalizeCompareAt(m: any): Money | null {
  const money = normalizeMoney(m);
  return money && Number(money.amount) > 0 ? money : null;
}

function normalizeCompareAtRange(range: any) {
  const min = normalizeCompareAt(range?.minVariantPrice);
  const max = normalizeCompareAt(range?.maxVariantPrice);
  if (!min) return undefined;
  return { minVariantPrice: min, maxVariantPrice: max ?? min };
}

function reshapeProduct(node: any): Product {
  const tags: string[] = node.tags ?? [];
  const images = flatten<any>(node.images).map((i) => normalizeImage(i, node.title));
  const featured = node.featuredImage
    ? normalizeImage(node.featuredImage, node.title)
    : images[0] ?? normalizeImage(null, node.title);

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description ?? '',
    descriptionHtml: node.descriptionHtml ?? '',
    tagline: node.tagline?.value,
    availableForSale: node.availableForSale ?? true,
    featuredImage: featured,
    images: images.length ? images : [featured],
    options: node.options ?? [],
    variants: flatten<any>(node.variants).map((vnode) => ({
      id: vnode.id,
      title: vnode.title,
      availableForSale: vnode.availableForSale,
      selectedOptions: vnode.selectedOptions ?? [],
      price: normalizeMoney(vnode.price) ?? { amount: '0', currencyCode: 'INR' },
      compareAtPrice: normalizeCompareAt(vnode.compareAtPrice),
    })),
    priceRange: node.priceRange,
    compareAtPriceRange: normalizeCompareAtRange(node.compareAtPriceRange),
    tags,
    universe: deriveUniverse(tags),
    productType: node.productType || undefined,
    material: node.material?.value,
    badge: node.badge?.value,
  };
}

// ————————————————————————————————————————————————————————————————
//  Public API
// ————————————————————————————————————————————————————————————————

export async function getProducts(options?: {
  /** Scope to a storefront section (matches the product's Shopify tag). */
  section?: Section;
  /** Free-text search (title, tag, type…). Combined with `section`. */
  query?: string;
  first?: number;
  /** Shopify sort key — e.g. 'CREATED_AT' for newest-first drops. */
  sortKey?: 'CREATED_AT' | 'BEST_SELLING' | 'PRICE' | 'TITLE' | 'UPDATED_AT';
  /** Reverse the sort (with CREATED_AT this gives newest first). */
  reverse?: boolean;
}): Promise<Product[]> {
  const { section, query, first = 50, sortKey, reverse } = options ?? {};

  if (!isShopifyConfigured) {
    warnNotConfigured();
    return [];
  }

  // Compose a Shopify search query that scopes to the section tag.
  const searchParts = [query, section ? `tag:${section}` : ''].filter(Boolean);
  try {
    const data = await shopifyFetch<{ products: Edges<any> }>({
      query: GET_PRODUCTS_QUERY,
      variables: {
        first,
        query: searchParts.join(' ') || undefined,
        sortKey,
        reverse,
      },
      tags: ['products'],
    });
    return flatten<any>(data.products).map(reshapeProduct);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[qavier] getProducts failed:', err);
    return [];
  }
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  if (!isShopifyConfigured) {
    warnNotConfigured();
    return undefined;
  }

  try {
    const data = await shopifyFetch<{ product: any }>({
      query: GET_PRODUCT_BY_HANDLE_QUERY,
      variables: { handle },
      tags: ['products', `product:${handle}`],
    });
    return data.product ? reshapeProduct(data.product) : undefined;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[qavier] getProduct(${handle}) failed:`, err);
    return undefined;
  }
}

export async function getCollection(
  handle: string,
  first = 50,
): Promise<Collection | undefined> {
  if (!isShopifyConfigured) {
    warnNotConfigured();
    return undefined;
  }

  const data = await shopifyFetch<{ collection: any }>({
    query: GET_COLLECTION_QUERY,
    variables: { handle, first },
    tags: ['collections', `collection:${handle}`],
  });
  const c = data.collection;
  if (!c) return undefined;
  const products = flatten<any>(c.products).map(reshapeProduct);
  return {
    id: c.id,
    handle: c.handle,
    title: c.title,
    description: c.description ?? '',
    image: c.image ? normalizeImage(c.image, c.title) : null,
    universe: products[0]?.universe ?? 'luxe',
    products,
  };
}

export interface ProductRef {
  handle: string;
  universe: Universe;
  /** Shopify's own last-modified timestamp, for <lastmod>. */
  updatedAt?: string;
}

/**
 * Every product in the store as a handle + universe + updated date, for the
 * sitemap. Unlike `getProducts` this pages through the whole catalogue rather
 * than stopping at the first 50, so large stores are listed in full.
 */
export async function getAllProductRefs(): Promise<ProductRef[]> {
  if (!isShopifyConfigured) {
    warnNotConfigured();
    return [];
  }

  const refs: ProductRef[] = [];
  let after: string | null = null;
  // Bounded so a pagination bug can never spin: 250 × 40 = 10,000 products.
  for (let page = 0; page < 40; page += 1) {
    try {
      const data: { products: Edges<any> & { pageInfo: any } } = await shopifyFetch({
        query: GET_PRODUCT_SITEMAP_QUERY,
        variables: { first: 250, after },
        tags: ['products'],
      });

      for (const node of flatten<any>(data.products)) {
        if (!node?.handle) continue;
        refs.push({
          handle: node.handle,
          universe: deriveUniverse(node.tags ?? []),
          updatedAt: node.updatedAt,
        });
      }

      if (!data.products.pageInfo?.hasNextPage) break;
      after = data.products.pageInfo.endCursor;
    } catch (err) {
      // Return what we have — a partial sitemap beats no sitemap.
      // eslint-disable-next-line no-console
      console.error('[qavier] getAllProductRefs failed:', err);
      break;
    }
  }

  return refs;
}

export interface VariantSnapshot {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice: Money | null;
  productHandle?: string;
  productTitle?: string;
}

/**
 * Live prices for a set of variant IDs, keyed by ID. Read uncached — this backs
 * the cart, where a stale price is a wrong price. Variants that no longer exist
 * are simply absent from the result.
 */
export async function getVariantPrices(
  ids: string[],
): Promise<Record<string, VariantSnapshot>> {
  if (!isShopifyConfigured || !ids.length) {
    if (!isShopifyConfigured) warnNotConfigured();
    return {};
  }

  try {
    const data = await shopifyFetch<{ nodes: (any | null)[] }>({
      query: GET_VARIANT_PRICES_QUERY,
      variables: { ids },
      cache: 'no-store',
    });

    const out: Record<string, VariantSnapshot> = {};
    for (const node of data.nodes ?? []) {
      const price = normalizeMoney(node?.price);
      if (!node?.id || !price) continue;
      out[node.id] = {
        id: node.id,
        title: node.title,
        availableForSale: node.availableForSale ?? true,
        price,
        compareAtPrice: normalizeCompareAt(node.compareAtPrice),
        productHandle: node.product?.handle,
        productTitle: node.product?.title,
      };
    }
    return out;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[qavier] getVariantPrices failed:', err);
    return {};
  }
}

// ————————————————————————————————————————————————————————————————
//  Cart — only available when Shopify is connected.
//  (Demo mode uses a client-side cart; see components/cart.)
// ————————————————————————————————————————————————————————————————
function reshapeCart(node: any): Cart {
  return {
    id: node.id,
    checkoutUrl: node.checkoutUrl,
    totalQuantity: node.totalQuantity,
    cost: node.cost,
    lines: flatten<any>(node.lines).map((l) => ({
      id: l.id,
      quantity: l.quantity,
      cost: l.cost,
      merchandise: {
        id: l.merchandise.id,
        title: l.merchandise.title,
        selectedOptions: l.merchandise.selectedOptions ?? [],
        product: {
          title: l.merchandise.product.title,
          handle: l.merchandise.product.handle,
          featuredImage: normalizeImage(
            l.merchandise.product.featuredImage,
            l.merchandise.product.title,
          ),
          universe: deriveUniverse(l.merchandise.product.tags ?? []),
        },
      },
    })),
  };
}

export async function createCart(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: { cart: any } }>({
    query: CREATE_CART_MUTATION,
    variables: { lines },
    cache: 'no-store',
  });
  return reshapeCart(data.cartCreate.cart);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: any } }>({
    query: ADD_TO_CART_MUTATION,
    variables: { cartId, lines },
    cache: 'no-store',
  });
  return reshapeCart(data.cartLinesAdd.cart);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesUpdate: { cart: any } }>({
    query: UPDATE_CART_MUTATION,
    variables: { cartId, lines },
    cache: 'no-store',
  });
  return reshapeCart(data.cartLinesUpdate.cart);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const data = await shopifyFetch<{ cartLinesRemove: { cart: any } }>({
    query: REMOVE_FROM_CART_MUTATION,
    variables: { cartId, lineIds },
    cache: 'no-store',
  });
  return reshapeCart(data.cartLinesRemove.cart);
}

export async function getCart(cartId: string): Promise<Cart | undefined> {
  const data = await shopifyFetch<{ cart: any }>({
    query: GET_CART_QUERY,
    variables: { cartId },
    cache: 'no-store',
  });
  return data.cart ? reshapeCart(data.cart) : undefined;
}
