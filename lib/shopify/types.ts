/**
 * Normalised domain types used across the Qavier app.
 *
 * These are intentionally simpler than the raw Shopify Storefront API shapes —
 * `lib/shopify/index.ts` reshapes Shopify's edge/node connections into these
 * flat structures so UI components stay clean. The same types describe the
 * built-in demo catalogue, so the front end never knows (or cares) whether the
 * data came from Shopify or the local mock.
 */

export type Universe = 'luxe' | 'pops';

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface Image {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
  /** When true the UI renders a branded "photo coming soon" frame. */
  placeholder?: boolean;
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: Money;
  compareAtPrice?: Money | null;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  /** Marketing one-liner shown on cards. */
  tagline?: string;
  availableForSale: boolean;
  featuredImage: Image;
  images: Image[];
  options: ProductOption[];
  variants: ProductVariant[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  compareAtPriceRange?: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  tags: string[];
  /** Which universe this product belongs to (derived from tags/collection). */
  universe: Universe;
  /** Optional editorial fields surfaced by metafields or the demo data. */
  material?: string;
  badge?: string;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: Image | null;
  universe: Universe;
  products: Product[];
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      handle: string;
      featuredImage: Image;
      universe: Universe;
    };
    selectedOptions: { name: string; value: string }[];
  };
  cost: {
    totalAmount: Money;
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartLine[];
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount?: Money | null;
  };
}
