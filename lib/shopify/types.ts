/**
 * Normalised domain types used across the Qavier app.
 *
 * These are intentionally simpler than the raw Shopify Storefront API shapes —
 * `lib/shopify/index.ts` reshapes Shopify's edge/node connections into these
 * flat structures so UI components stay clean. The same types describe the
 * built-in demo catalogue, so the front end never knows (or cares) whether the
 * data came from Shopify or the local mock.
 */


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
  /** Shopify product "Type" — used as the shop's category facet. */
  productType?: string;
  /** Optional editorial fields surfaced by metafields. */
  material?: string;
  badge?: string;
}

/**
 * A collection without its products — what the nav menu, the collections
 * index and the home-page tiles need. Kept separate from `Collection` so
 * listing twenty collections doesn't drag twenty product sets with it.
 */
export interface CollectionSummary {
  id: string;
  handle: string;
  title: string;
  description: string;
  /**
   * The collection image from Shopify, or the first product's photo when no
   * collection image is set — so a tile is never empty just because nobody
   * uploaded banner art.
   */
  image: Image | null;
}

export interface Collection extends CollectionSummary {
  descriptionHtml: string;
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
