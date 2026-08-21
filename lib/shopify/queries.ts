/**
 * GraphQL documents for the Shopify Storefront API.
 *
 * Kept as plain template strings (no codegen dependency) so the project stays
 * lightweight. Fragments are composed manually below.
 */

const IMAGE_FRAGMENT = /* GraphQL */ `
  fragment ImageFields on Image {
    url
    altText
    width
    height
  }
`;

// Cheap, scalar-only fields shared by every product query. (No connections
// here — those drive Storefront API query cost, so they're added per-fragment.)
const PRODUCT_BASE_FIELDS = /* GraphQL */ `
  id
  handle
  title
  description
  descriptionHtml
  availableForSale
  tags
  productType
  featuredImage {
    ...ImageFields
  }
  options {
    id
    name
    values
  }
  priceRange {
    minVariantPrice { amount currencyCode }
    maxVariantPrice { amount currencyCode }
  }
  compareAtPriceRange {
    minVariantPrice { amount currencyCode }
    maxVariantPrice { amount currencyCode }
  }
  material: metafield(namespace: "custom", key: "material") { value }
  tagline: metafield(namespace: "custom", key: "tagline") { value }
  badge: metafield(namespace: "custom", key: "badge") { value }
`;

// Lightweight fragment for product LISTS (cards, rails, filters). Deliberately
// omits the (expensive) variants connection and keeps images small so a
// `products(first: 50)` query stays well under the 1000-point cost limit.
// Size/colour facets are derived from `options`, so variants aren't needed here.
const PRODUCT_CARD_FRAGMENT = /* GraphQL */ `
  fragment ProductCard on Product {
    ${PRODUCT_BASE_FIELDS}
    images(first: 4) {
      edges { node { ...ImageFields } }
    }
  }
  ${IMAGE_FRAGMENT}
`;

// Full fragment for a SINGLE product page (needs every variant for the picker).
const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    ${PRODUCT_BASE_FIELDS}
    images(first: 12) {
      edges { node { ...ImageFields } }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions { name value }
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
`;

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                title
                handle
                tags
                featuredImage {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Live re-price lookup for cart lines. Deliberately tiny: the cart stores a
// snapshot of each line when it was added, and this re-reads the authoritative
// price straight from Shopify (uncached) so a price edit in the admin shows up
// in an existing bag instead of the stale snapshot.
export const GET_VARIANT_PRICES_QUERY = /* GraphQL */ `
  query getVariantPrices($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on ProductVariant {
        id
        title
        availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        product {
          handle
          title
        }
      }
    }
  }
`;

// Sitemap feed: just enough to build a URL and date it. Scalars only, so a
// full page of 250 stays cheap, and cursor-paginated so stores larger than a
// single page are still listed in full.
export const GET_PRODUCT_SITEMAP_QUERY = /* GraphQL */ `
  query getProductSitemap($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          handle
          tags
          updatedAt
        }
      }
    }
  }
`;

export const GET_PRODUCTS_QUERY = /* GraphQL */ `
  query getProducts($first: Int!, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
      edges {
        node {
          ...ProductCard
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export const GET_PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const GET_COLLECTION_QUERY = /* GraphQL */ `
  query getCollection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        ...ImageFields
      }
      products(first: $first) {
        edges {
          node {
            ...ProductCard
          }
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export const CREATE_CART_MUTATION = /* GraphQL */ `
  mutation cartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const ADD_TO_CART_MUTATION = /* GraphQL */ `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const UPDATE_CART_MUTATION = /* GraphQL */ `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const REMOVE_FROM_CART_MUTATION = /* GraphQL */ `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const GET_CART_QUERY = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;
