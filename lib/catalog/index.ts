/**
 * The store's collection catalogue — one list, read three ways.
 *
 * `collections.json` defines every collection the storefront is designed
 * around as a Shopify *smart* collection: a handle, a title and the rules
 * that fill it (tag and product-type conditions). The same file is
 *
 *  • created in Shopify by `scripts/create-collections.mjs`,
 *  • evaluated here against the demo catalogue, so a preview shows exactly
 *    what the real store will show once its products are tagged, and
 *  • referenced by handle from the menu (`lib/nav.ts`), the footer, the home
 *    page and the collection pages.
 *
 * Products land in collections by their `men` / `women` / `kids` tag plus
 * their Shopify product type, so tagging and typing a product is all it takes
 * to place it everywhere it belongs.
 */
import data from './collections.json';
import type { Product } from '../shopify/types';

export type RuleColumn = 'TAG' | 'TYPE' | 'VARIANT_PRICE' | 'VARIANT_COMPARE_AT_PRICE';
export type RuleRelation = 'EQUALS' | 'CONTAINS' | 'GREATER_THAN' | 'LESS_THAN';

export interface CollectionRule {
  column: RuleColumn;
  relation: RuleRelation;
  condition: string;
}

export interface CollectionDef {
  handle: string;
  title: string;
  description?: string;
  sortOrder: string;
  /** `all`: every rule must hold. `any`: one is enough. */
  match: 'all' | 'any';
  rules: CollectionRule[];
}

export const COLLECTION_DEFS = data.collections as CollectionDef[];

/** The product types the rules expect, in menu order. */
export const PRODUCT_TYPES: string[] = data.productTypes;

/** The tags the rules read. */
export const CATALOG_TAGS: string[] = data.tags;

const lower = (s: string) => s.trim().toLowerCase();

function money(p: Product, key: 'price' | 'compareAtPrice'): number[] {
  return p.variants.length
    ? p.variants.map((v) => Number(v[key]?.amount ?? 0))
    : [
        Number(
          (key === 'price'
            ? p.priceRange.minVariantPrice
            : p.compareAtPriceRange?.minVariantPrice
          )?.amount ?? 0,
        ),
      ];
}

/**
 * Whether one rule holds for a product, the way Shopify evaluates it: text
 * comparisons ignore case, and price rules hold when any variant matches.
 */
export function ruleHolds(product: Product, rule: CollectionRule): boolean {
  const condition = lower(rule.condition);
  switch (rule.column) {
    case 'TAG':
      return product.tags.some((t) => lower(t) === condition);
    case 'TYPE': {
      const type = lower(product.productType ?? '');
      return rule.relation === 'EQUALS' ? type === condition : type.includes(condition);
    }
    case 'VARIANT_PRICE':
    case 'VARIANT_COMPARE_AT_PRICE': {
      const values = money(product, rule.column === 'VARIANT_PRICE' ? 'price' : 'compareAtPrice');
      const n = Number(rule.condition);
      return values.some((v) =>
        rule.relation === 'GREATER_THAN' ? v > n : rule.relation === 'LESS_THAN' ? v < n : v === n,
      );
    }
    default:
      return false;
  }
}

/** Whether a product belongs in a collection. */
export function inCollection(product: Product, def: CollectionDef): boolean {
  return def.match === 'any'
    ? def.rules.some((r) => ruleHolds(product, r))
    : def.rules.every((r) => ruleHolds(product, r));
}

export function collectionDef(handle: string): CollectionDef | undefined {
  return COLLECTION_DEFS.find((d) => d.handle === handle);
}
