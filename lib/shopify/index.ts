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
  REMOVE_FROM_CART_MUTATION,
  UPDATE_CART_MUTATION,
} from './queries';
import type {
  Cart,
  Collection,
  Image,
  Product,
  Section,
  Universe,
} from './types';

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-07';

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
  revalidate = 60,
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
      price: vnode.price,
      compareAtPrice: vnode.compareAtPrice,
    })),
    priceRange: node.priceRange,
    compareAtPriceRange: node.compareAtPriceRange,
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
}): Promise<Product[]> {
  const { section, query, first = 50 } = options ?? {};

  if (!isShopifyConfigured) {
    warnNotConfigured();
    return [];
  }

  // Compose a Shopify search query that scopes to the section tag.
  const searchParts = [query, section ? `tag:${section}` : ''].filter(Boolean);
  try {
    const data = await shopifyFetch<{ products: Edges<any> }>({
      query: GET_PRODUCTS_QUERY,
      variables: { first, query: searchParts.join(' ') || undefined },
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
