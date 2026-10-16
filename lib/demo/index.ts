/**
 * The demo catalogue — what the store shows before Shopify is connected.
 *
 * It exists so every page can be seen fully composed (menu, grids, product
 * pages, the bag) on a preview deployment or a laptop, with no store behind
 * it. It is never served to real shoppers: `DEMO_CATALOGUE` is off on a
 * Vercel production deployment and whenever Shopify is configured, so the
 * live site still shows only real Shopify data.
 *
 * Photography: each product reads `public/images/demo/<handle>-<n>.jpg`
 * (n = 1–4) when the file exists, and otherwise draws a flat illustration of
 * the garment in its colourway. Drop photographs in and they take over with
 * no code change.
 */
import fs from 'node:fs';
import path from 'node:path';
import { COLLECTION_DEFS, inCollection } from '../catalog';
import { swatchColor } from '../swatch';
import type {
  Collection,
  CollectionSummary,
  GarmentKind,
  Image,
  Product,
  ProductVariant,
} from '../shopify/types';

/**
 * Serve the demo catalogue? Only without Shopify, never on Vercel production,
 * and QAVIER_DEMO=off turns it off anywhere.
 */
export function demoEnabled(shopifyConfigured: boolean): boolean {
  if (shopifyConfigured) return false;
  if (process.env.QAVIER_DEMO === 'off') return false;
  if (process.env.QAVIER_DEMO === 'on') return true;
  return process.env.VERCEL_ENV !== 'production';
}

type Audience = 'men' | 'women' | 'kids' | 'unisex';

interface DemoSpec {
  handle: string;
  title: string;
  type: string;
  kind: GarmentKind;
  audience: Audience;
  colors: string[];
  price: number;
  compareAt?: number;
  /** Merchandising tags: new · bestseller · golf · gift · big-and-tall. */
  flags?: ('new' | 'bestseller' | 'golf' | 'gift' | 'big-and-tall')[];
  sizes?: string[];
  tagline: string;
  material: string;
  /** Sizes that are sold out in every colour, for a realistic size row. */
  soldOut?: string[];
}

const ADULT = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const KIDS = ['4Y', '6Y', '8Y', '10Y', '12Y', '14Y'];
const ONE = ['One Size'];
const WAIST = ['28', '30', '32', '34', '36', '38'];

const SPECS: DemoSpec[] = [
  // ——— Men ———
  {
    handle: 'signature-pima-polo',
    title: 'Signature Pima Polo',
    type: 'Polos',
    kind: 'polo',
    audience: 'men',
    colors: ['Black', 'White', 'Navy', 'Sage'],
    price: 2490,
    flags: ['bestseller', 'gift', 'big-and-tall'],
    tagline: 'The polo everything else is built around — soft pique, clean collar.',
    material: '100% Pima cotton pique',
    soldOut: ['XS'],
  },
  {
    handle: 'tipped-collar-polo',
    title: 'Tipped Collar Polo',
    type: 'Polos',
    kind: 'polo',
    audience: 'men',
    colors: ['Navy', 'White', 'Burgundy'],
    price: 2690,
    flags: ['new'],
    tagline: 'A contrast tip on the collar and cuffs, for a sharper finish.',
    material: '100% cotton pique',
  },
  {
    handle: 'course-performance-polo',
    title: 'Course Performance Polo',
    type: 'Polos',
    kind: 'polo',
    audience: 'men',
    colors: ['White', 'Sky Blue', 'Charcoal'],
    price: 2990,
    flags: ['new', 'golf'],
    tagline: 'Four-way stretch and quick-dry jersey, cut to swing in.',
    material: '88% polyester, 12% elastane',
  },
  {
    handle: 'striped-knit-polo',
    title: 'Striped Knit Polo',
    type: 'Polos',
    kind: 'polo',
    audience: 'men',
    colors: ['Cream', 'Navy'],
    price: 3290,
    compareAt: 4290,
    tagline: 'A fine-gauge knit with a resort feel.',
    material: '100% cotton knit',
  },
  {
    handle: 'heavyweight-crew-tee',
    title: 'Heavyweight Crew Tee',
    type: 'T-Shirts',
    kind: 'tee',
    audience: 'men',
    colors: ['Black', 'White', 'Heather Grey', 'Olive'],
    price: 1490,
    flags: ['bestseller', 'big-and-tall'],
    tagline: 'Dense 240gsm jersey that holds its shape wash after wash.',
    material: '100% combed cotton, 240gsm',
  },
  {
    handle: 'monogram-graphic-tee',
    title: 'Monogram Graphic Tee',
    type: 'T-Shirts',
    kind: 'tee',
    audience: 'men',
    colors: ['White', 'Black'],
    price: 1690,
    flags: ['new'],
    tagline: 'A tonal Q monogram, screen-printed on the chest.',
    material: '100% cotton jersey',
  },
  {
    handle: 'garment-dyed-pocket-tee',
    title: 'Garment-Dyed Pocket Tee',
    type: 'T-Shirts',
    kind: 'tee',
    audience: 'men',
    colors: ['Sand', 'Slate', 'Rust'],
    price: 1590,
    compareAt: 1990,
    tagline: 'Dyed after it is sewn, for a lived-in colour from day one.',
    material: '100% cotton jersey',
  },
  {
    handle: 'loopback-hoodie',
    title: 'Loopback Hoodie',
    type: 'Sweatshirts & Hoodies',
    kind: 'hoodie',
    audience: 'men',
    colors: ['Black', 'Heather Grey', 'Navy'],
    price: 3290,
    flags: ['bestseller', 'gift', 'big-and-tall'],
    tagline: 'Midweight loopback terry with a double-layer hood.',
    material: '100% cotton loopback terry',
    soldOut: ['XXL'],
  },
  {
    handle: 'brushed-fleece-crewneck',
    title: 'Brushed Fleece Crewneck',
    type: 'Sweatshirts & Hoodies',
    kind: 'crewneck',
    audience: 'men',
    colors: ['Oat', 'Black', 'Forest'],
    price: 2990,
    flags: ['new'],
    tagline: 'Brushed inside for warmth, ribbed at the hem and cuffs.',
    material: '80% cotton, 20% polyester fleece',
  },
  {
    handle: 'quarter-zip-pullover',
    title: 'Quarter-Zip Pullover',
    type: 'Sweatshirts & Hoodies',
    kind: 'quarterzip',
    audience: 'men',
    colors: ['Navy', 'White'],
    price: 3490,
    flags: ['golf'],
    tagline: 'A light layer for early tee times and cool evenings.',
    material: '92% polyester, 8% elastane',
  },
  {
    handle: 'nylon-coach-jacket',
    title: 'Nylon Coach Jacket',
    type: 'Outerwear',
    kind: 'jacket',
    audience: 'men',
    colors: ['Black', 'Olive'],
    price: 4990,
    flags: ['new'],
    tagline: 'Water-resistant shell, snap front, mesh lined.',
    material: '100% nylon shell, polyester mesh lining',
  },
  {
    handle: 'quilted-gilet',
    title: 'Quilted Gilet',
    type: 'Outerwear',
    kind: 'gilet',
    audience: 'men',
    colors: ['Navy', 'Black'],
    price: 4490,
    flags: ['golf'],
    tagline: 'Core warmth without the sleeves getting in the way.',
    material: '100% recycled polyester',
  },
  {
    handle: 'fleece-jogger',
    title: 'Fleece Jogger',
    type: 'Bottoms',
    kind: 'pants',
    audience: 'men',
    colors: ['Black', 'Heather Grey'],
    price: 2790,
    flags: ['bestseller', 'big-and-tall'],
    tagline: 'Tapered leg, ribbed cuff, deep side pockets.',
    material: '80% cotton, 20% polyester fleece',
  },
  {
    handle: 'four-way-stretch-trouser',
    title: 'Four-Way Stretch Trouser',
    type: 'Bottoms',
    kind: 'pants',
    audience: 'men',
    colors: ['Stone', 'Navy', 'Black'],
    price: 3490,
    flags: ['golf'],
    sizes: WAIST,
    tagline: 'Moves like a jogger, looks like a chino.',
    material: '90% polyester, 10% elastane',
  },
  {
    handle: 'french-terry-short',
    title: 'French Terry Short',
    type: 'Bottoms',
    kind: 'shorts',
    audience: 'men',
    colors: ['Black', 'Heather Grey', 'Navy'],
    price: 1790,
    tagline: 'A 7-inch inseam and a drawcord waist.',
    material: '100% cotton French terry',
  },
  {
    handle: 'printed-swim-short',
    title: 'Printed Swim Short',
    type: 'Swimwear',
    kind: 'shorts',
    audience: 'men',
    colors: ['Navy', 'Coral'],
    price: 1990,
    compareAt: 2490,
    tagline: 'Quick-dry, mesh lined, with a zip back pocket.',
    material: '100% recycled polyester',
  },

  // ——— Women ———
  {
    handle: 'cropped-pique-polo',
    title: 'Cropped Pique Polo',
    type: 'Polos',
    kind: 'polo',
    audience: 'women',
    colors: ['White', 'Black', 'Blush'],
    price: 2290,
    flags: ['new'],
    tagline: 'A boxy, cropped take on the classic polo.',
    material: '100% cotton pique',
  },
  {
    handle: 'fitted-rib-polo',
    title: 'Fitted Rib Polo',
    type: 'Polos',
    kind: 'polo',
    audience: 'women',
    colors: ['Navy', 'Cream'],
    price: 2390,
    flags: ['bestseller'],
    tagline: 'A close-fitting rib knit with a long-point collar.',
    material: '95% cotton, 5% elastane rib',
  },
  {
    handle: 'baby-tee',
    title: 'Baby Tee',
    type: 'T-Shirts',
    kind: 'tee',
    audience: 'women',
    colors: ['White', 'Black', 'Lilac'],
    price: 1290,
    flags: ['new'],
    tagline: 'Shrunken fit, short sleeve, soft stretch jersey.',
    material: '95% cotton, 5% elastane',
  },
  {
    handle: 'boxy-logo-tee',
    title: 'Boxy Logo Tee',
    type: 'T-Shirts',
    kind: 'tee',
    audience: 'women',
    colors: ['Heather Grey', 'White'],
    price: 1390,
    tagline: 'Dropped shoulders and a small chest logo.',
    material: '100% cotton jersey',
  },
  {
    handle: 'boxy-crew-sweatshirt',
    title: 'Boxy Crew Sweatshirt',
    type: 'Sweatshirts & Hoodies',
    kind: 'crewneck',
    audience: 'women',
    colors: ['Oat', 'Sage'],
    price: 2890,
    tagline: 'Wide through the body, cropped at the hip.',
    material: '80% cotton, 20% polyester fleece',
  },
  {
    handle: 'zip-through-hoodie',
    title: 'Zip-Through Hoodie',
    type: 'Sweatshirts & Hoodies',
    kind: 'hoodie',
    audience: 'women',
    colors: ['Black', 'Heather Grey'],
    price: 3190,
    compareAt: 3990,
    tagline: 'A two-way zip and a relaxed, easy fit.',
    material: '100% cotton loopback terry',
  },
  {
    handle: 'pleated-tennis-skirt',
    title: 'Pleated Tennis Skirt',
    type: 'Bottoms',
    kind: 'skirt',
    audience: 'women',
    colors: ['White', 'Navy'],
    price: 2190,
    flags: ['new', 'golf'],
    tagline: 'Knife pleats with built-in shorts underneath.',
    material: '88% polyester, 12% elastane',
  },
  {
    handle: 'wide-leg-sweatpant',
    title: 'Wide-Leg Sweatpant',
    type: 'Bottoms',
    kind: 'pants',
    audience: 'women',
    colors: ['Heather Grey', 'Black'],
    price: 2590,
    tagline: 'High-rise and wide-leg, in a heavy fleece.',
    material: '80% cotton, 20% polyester fleece',
  },

  // ——— Kids ———
  {
    handle: 'kids-signature-polo',
    title: 'Kids Signature Polo',
    type: 'Polos',
    kind: 'polo',
    audience: 'kids',
    colors: ['White', 'Navy', 'Sky Blue'],
    price: 1490,
    flags: ['bestseller'],
    tagline: 'The grown-up polo, cut for smaller shoulders.',
    material: '100% cotton pique',
  },
  {
    handle: 'kids-logo-tee',
    title: 'Kids Logo Tee',
    type: 'T-Shirts',
    kind: 'tee',
    audience: 'kids',
    colors: ['Black', 'White', 'Yellow'],
    price: 990,
    flags: ['new'],
    tagline: 'Soft jersey and a small chest logo.',
    material: '100% cotton jersey',
  },
  {
    handle: 'kids-pullover-hoodie',
    title: 'Kids Pullover Hoodie',
    type: 'Sweatshirts & Hoodies',
    kind: 'hoodie',
    audience: 'kids',
    colors: ['Heather Grey', 'Navy'],
    price: 1890,
    tagline: 'Kangaroo pocket, lined hood, made for the playground.',
    material: '80% cotton, 20% polyester fleece',
  },
  {
    handle: 'kids-fleece-jogger',
    title: 'Kids Fleece Jogger',
    type: 'Bottoms',
    kind: 'pants',
    audience: 'kids',
    colors: ['Black', 'Heather Grey'],
    price: 1490,
    compareAt: 1890,
    tagline: 'An elastic waist and cuffs that stay put.',
    material: '80% cotton, 20% polyester fleece',
  },
  {
    handle: 'kids-tee-and-short-set',
    title: 'Kids Tee & Short Set',
    type: 'Matching Sets',
    kind: 'tee',
    audience: 'kids',
    colors: ['Navy', 'Sage'],
    price: 1990,
    flags: ['new'],
    tagline: 'A matching tee and short, ready for summer.',
    material: '100% cotton jersey',
  },

  // ——— Accessories ———
  {
    handle: 'six-panel-cap',
    title: 'Six-Panel Cap',
    type: 'Hats & Caps',
    kind: 'cap',
    audience: 'unisex',
    colors: ['Black', 'Navy', 'Stone'],
    price: 990,
    flags: ['bestseller', 'golf', 'gift'],
    sizes: ONE,
    tagline: 'Washed cotton twill with an adjustable strap.',
    material: '100% cotton twill',
  },
  {
    handle: 'washed-bucket-hat',
    title: 'Washed Bucket Hat',
    type: 'Hats & Caps',
    kind: 'bucket',
    audience: 'unisex',
    colors: ['Sand', 'Black'],
    price: 1190,
    flags: ['new', 'gift'],
    sizes: ONE,
    tagline: 'A soft, packable brim for sunny days.',
    material: '100% cotton canvas',
  },
  {
    handle: 'ribbed-crew-socks-3-pack',
    title: 'Ribbed Crew Socks — 3 Pack',
    type: 'Socks',
    kind: 'socks',
    audience: 'unisex',
    colors: ['White', 'Black'],
    price: 690,
    sizes: ONE,
    flags: ['gift'],
    tagline: 'Cushioned sole, ribbed leg, three to a pack.',
    material: '80% cotton, 18% polyamide, 2% elastane',
  },
  {
    handle: 'heavy-canvas-tote',
    title: 'Heavy Canvas Tote',
    type: 'Bags & Wallets',
    kind: 'tote',
    audience: 'unisex',
    colors: ['Ecru', 'Black'],
    price: 1290,
    sizes: ONE,
    flags: ['gift'],
    tagline: 'Holds a laptop, a change of clothes and then some.',
    material: '16oz cotton canvas',
  },
  {
    handle: 'leather-belt',
    title: 'Leather Belt',
    type: 'Belts',
    kind: 'belt',
    audience: 'unisex',
    colors: ['Black', 'Brown'],
    price: 1490,
    sizes: ['S', 'M', 'L', 'XL'],
    flags: ['gift'],
    tagline: 'Full-grain leather with a brushed metal buckle.',
    material: 'Full-grain leather',
  },

  // ——— Filling out the catalogue ———
  {
    handle: 'oxford-button-down-shirt',
    title: 'Oxford Button-Down Shirt',
    type: 'Shirts',
    kind: 'jacket',
    audience: 'men',
    colors: ['White', 'Sky Blue'],
    price: 2790,
    flags: ['new'],
    tagline: 'Soft oxford cloth with a button-down collar.',
    material: '100% cotton oxford',
  },
  {
    handle: 'cable-knit-crewneck',
    title: 'Cable Knit Crewneck',
    type: 'Sweaters & Knits',
    kind: 'crewneck',
    audience: 'men',
    colors: ['Cream', 'Navy'],
    price: 3990,
    tagline: 'A chunky cable knit for cooler evenings.',
    material: '100% cotton knit',
  },
  {
    handle: 'terry-tee-and-short-set',
    title: 'Terry Tee & Short Set',
    type: 'Matching Sets',
    kind: 'tee',
    audience: 'men',
    colors: ['Sand', 'Black'],
    price: 3290,
    flags: ['new'],
    tagline: 'A matching tee and short in loopback terry.',
    material: '100% cotton terry',
  },
  {
    handle: 'cropped-track-jacket',
    title: 'Cropped Track Jacket',
    type: 'Outerwear',
    kind: 'jacket',
    audience: 'women',
    colors: ['Black', 'Navy'],
    price: 3690,
    flags: ['new'],
    tagline: 'A cropped, zip-front track jacket.',
    material: '100% recycled polyester',
  },
  {
    handle: 'kids-puffer-jacket',
    title: 'Kids Puffer Jacket',
    type: 'Outerwear',
    kind: 'jacket',
    audience: 'kids',
    colors: ['Navy', 'Olive'],
    price: 2990,
    tagline: 'Light, warm and easy to zip.',
    material: '100% recycled polyester',
  },
  {
    handle: 'kids-swim-short',
    title: 'Kids Swim Short',
    type: 'Swimwear',
    kind: 'shorts',
    audience: 'kids',
    colors: ['Coral', 'Sky Blue'],
    price: 1190,
    tagline: 'Quick-dry with a mesh lining.',
    material: '100% recycled polyester',
  },
];

// ————————————————————————————————————————————————————————————————
//  Building products
// ————————————————————————————————————————————————————————————————

const CURRENCY = 'INR';
const money = (amount: number) => ({ amount: amount.toFixed(2), currencyCode: CURRENCY });

const PHOTO_DIR = path.join(process.cwd(), 'public', 'images', 'demo');

/** The photograph for a slot, if one has been dropped into public/. */
function photo(handle: string, n: number): string | null {
  for (const ext of ['jpg', 'webp', 'png']) {
    const file = `${handle}-${n}.${ext}`;
    try {
      if (fs.existsSync(path.join(PHOTO_DIR, file))) return `/images/demo/${file}`;
    } catch {
      /* no filesystem (edge) — fall back to the illustration */
    }
  }
  return null;
}

function imagesFor(spec: DemoSpec): Image[] {
  // Front and back of the first two colourways: four frames, which is what
  // the product page's two-up gallery is laid out for.
  const shots = spec.colors.slice(0, 2).flatMap((color) => [
    { color, view: 'front' as const },
    { color, view: 'back' as const },
  ]);

  return shots.map((shot, i) => {
    const url = photo(spec.handle, i + 1);
    return {
      url: url ?? '',
      altText: `${spec.title} in ${shot.color}${shot.view === 'back' ? ', back' : ''}`,
      width: 1200,
      height: 1500,
      art: { kind: spec.kind, color: swatchColor(shot.color), view: shot.view },
    };
  });
}

function buildProduct(spec: DemoSpec, index: number): Product {
  const sizes = spec.sizes ?? (spec.audience === 'kids' ? KIDS : ADULT);
  const images = imagesFor(spec);
  const price = money(spec.price);
  const compareAt = spec.compareAt ? money(spec.compareAt) : null;

  const variants: ProductVariant[] = spec.colors.flatMap((color) =>
    sizes.map((size) => ({
      id: `gid://qavier-demo/ProductVariant/${spec.handle}--${color}--${size}`
        .toLowerCase()
        .replace(/\s+/g, '-'),
      title: sizes.length > 1 ? `${color} / ${size}` : color,
      availableForSale: !spec.soldOut?.includes(size),
      selectedOptions: [
        { name: 'Color', value: color },
        { name: 'Size', value: size },
      ],
      price,
      compareAtPrice: compareAt,
    })),
  );

  const tags = [
    spec.audience,
    ...(spec.flags ?? []),
    ...(compareAt ? ['sale'] : []),
  ];

  const badge = spec.flags?.includes('new')
    ? 'New'
    : spec.flags?.includes('bestseller')
      ? 'Best Seller'
      : undefined;

  const description = `${spec.tagline} ${DESCRIPTIONS[spec.kind]}`;
  const prefix =
    spec.audience === 'men' ? 'Men’s ' : spec.audience === 'women' ? 'Women’s ' : '';

  return {
    id: `gid://qavier-demo/Product/${index + 1}`,
    handle: spec.handle,
    title: `${prefix}${spec.title}`,
    description,
    descriptionHtml: `<p>${spec.tagline}</p><p>${DESCRIPTIONS[spec.kind]}</p>`,
    tagline: spec.tagline,
    availableForSale: true,
    featuredImage: images[0],
    images,
    options: [
      { id: `${spec.handle}-color`, name: 'Color', values: spec.colors },
      { id: `${spec.handle}-size`, name: 'Size', values: sizes },
    ],
    variants,
    priceRange: { minVariantPrice: price, maxVariantPrice: price },
    compareAtPriceRange: compareAt
      ? { minVariantPrice: compareAt, maxVariantPrice: compareAt }
      : undefined,
    tags,
    productType: spec.type,
    material: spec.material,
    badge,
  };
}

const DESCRIPTIONS: Record<GarmentKind, string> = {
  polo: 'Three-button placket, ribbed collar and cuffs, and a split hem that sits right tucked or untucked.',
  tee: 'A regular fit through the body with a ribbed crew neck that keeps its shape.',
  hoodie: 'Kangaroo pocket, flat drawcords and ribbed cuffs and hem.',
  crewneck: 'A relaxed crew with ribbed trims and a soft brushed interior.',
  quarterzip: 'A stand collar, a quarter-length zip and flatlock seams that lie smooth under a jacket.',
  jacket: 'A boxy fit with snap closures, side pockets and a drawcord hem.',
  gilet: 'Lightweight insulation, a zip front and two zip hand pockets.',
  pants: 'An elastic waist with an internal drawcord and two deep side pockets.',
  shorts: 'An elastic waist, an internal drawcord and side pockets.',
  skirt: 'An A-line shape with a comfortable elastic waistband.',
  cap: 'Six panels, embroidered eyelets and a curved brim.',
  bucket: 'A soft crown, a stitched brim and an inside sweatband.',
  socks: 'Reinforced heel and toe, and a ribbed leg that stays up.',
  tote: 'Long handles, an inside pocket and a reinforced base.',
  belt: 'A 35mm strap with a brushed metal buckle.',
};

const PRODUCTS: Product[] = SPECS.map(buildProduct);

// ————————————————————————————————————————————————————————————————
//  Collections — rules over the products above
// ————————————————————————————————————————————————————————————————

/** A campaign photograph for collections that open with one. */
const CAMPAIGN: Record<string, Image> = {
  'new-arrivals': {
    url: '/images/desktop_qavier.png',
    altText: 'New Arrivals',
    width: 1586,
    height: 992,
  },
};

/**
 * Every collection in the catalogue, filled by the same rules Shopify uses —
 * so the demo shows exactly what the real store will once its products carry
 * the same tags and types.
 */
const COLLECTIONS: Collection[] = COLLECTION_DEFS.map((def, index) => {
  const products = PRODUCTS.filter((p) => inCollection(p, def));
  return {
    id: `gid://qavier-demo/Collection/${index + 1}`,
    handle: def.handle,
    title: def.title,
    description: def.description ?? '',
    descriptionHtml: def.description ? `<p>${def.description}</p>` : '',
    image: CAMPAIGN[def.handle] ?? products[0]?.featuredImage ?? null,
    products,
  };
});

// ————————————————————————————————————————————————————————————————
//  The same surface as lib/shopify, over the arrays above
// ————————————————————————————————————————————————————————————————

const matchesQuery = (p: Product, query: string) => {
  const hay = `${p.title} ${p.productType ?? ''} ${p.tags.join(' ')} ${p.options
    .flatMap((o) => o.values)
    .join(' ')}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word));
};

const has = (p: Product, tag: string) => p.tags.includes(tag);

/** Best sellers first, then the rest in catalogue order. */
const bestSellingRank = (p: Product) => (has(p, 'bestseller') ? 0 : 1);

export function demoProducts(options?: {
  query?: string;
  first?: number;
  sortKey?: string;
  reverse?: boolean;
}): Product[] {
  const { query, first = 50, sortKey } = options ?? {};
  let list = query ? PRODUCTS.filter((p) => matchesQuery(p, query)) : [...PRODUCTS];

  if (sortKey === 'BEST_SELLING') {
    list = list
      .map((p, i) => ({ p, i }))
      .sort((a, b) => bestSellingRank(a.p) - bestSellingRank(b.p) || a.i - b.i)
      .map((x) => x.p);
  } else if (sortKey === 'CREATED_AT') {
    // "Newest": new arrivals first.
    list = list
      .map((p, i) => ({ p, i }))
      .sort((a, b) => Number(!has(a.p, 'new')) - Number(!has(b.p, 'new')) || a.i - b.i)
      .map((x) => x.p);
  }

  return list.slice(0, first);
}

export function demoProduct(handle: string): Product | undefined {
  return PRODUCTS.find((p) => p.handle === handle);
}

export function demoCollection(handle: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.handle === handle);
}

export function demoCollections(): CollectionSummary[] {
  return COLLECTIONS.map(({ products: _products, descriptionHtml: _html, ...summary }) => summary);
}
