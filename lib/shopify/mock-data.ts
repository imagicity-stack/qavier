/**
 * Built-in demo catalogue.
 *
 * This powers the entire site until real Shopify credentials are added. Every
 * image is flagged `placeholder: true`, which tells the <ShopImage> component to
 * render a branded "photo coming soon" frame — so you can drop real photography
 * in later (via Shopify) without touching any layout.
 */
import type { Collection, Product, ProductVariant, Universe } from './types';

const CURRENCY = 'INR';

function money(amount: number) {
  return { amount: amount.toFixed(2), currencyCode: CURRENCY };
}

function placeholderImage(altText: string, ratio: 'portrait' | 'square' = 'portrait') {
  return {
    url: '',
    altText,
    width: ratio === 'portrait' ? 1200 : 1200,
    height: ratio === 'portrait' ? 1600 : 1200,
    placeholder: true,
  };
}

interface SeedInput {
  handle: string;
  title: string;
  tagline: string;
  description: string;
  price: number;
  compareAt?: number;
  universe: Universe;
  tags: string[];
  material: string;
  badge?: string;
  sizes?: string[];
  colors?: string[];
  imageCount?: number;
}

function buildProduct(seed: SeedInput): Product {
  const sizes = seed.sizes ?? ['XS', 'S', 'M', 'L', 'XL'];
  const colors = seed.colors ?? [];
  const imageCount = seed.imageCount ?? 4;

  const options = [
    { id: `${seed.handle}-opt-size`, name: 'Size', values: sizes },
    ...(colors.length
      ? [{ id: `${seed.handle}-opt-color`, name: 'Color', values: colors }]
      : []),
  ];

  // Build a variant per size (x color) combination.
  const variants: ProductVariant[] = [];
  const colorList = colors.length ? colors : [''];
  let v = 0;
  for (const size of sizes) {
    for (const color of colorList) {
      v += 1;
      const selectedOptions = [
        { name: 'Size', value: size },
        ...(color ? [{ name: 'Color', value: color }] : []),
      ];
      variants.push({
        id: `gid://qavier/ProductVariant/${seed.handle}-${v}`,
        title: color ? `${size} / ${color}` : size,
        availableForSale: !(size === 'XS' && v % 7 === 0), // a couple sold out for realism
        selectedOptions,
        price: money(seed.price),
        compareAtPrice: seed.compareAt ? money(seed.compareAt) : null,
      });
    }
  }

  const images = Array.from({ length: imageCount }, (_, i) =>
    placeholderImage(`${seed.title} — view ${i + 1}`, i % 3 === 2 ? 'square' : 'portrait'),
  );

  return {
    id: `gid://qavier/Product/${seed.handle}`,
    handle: seed.handle,
    title: seed.title,
    tagline: seed.tagline,
    description: seed.description,
    descriptionHtml: `<p>${seed.description}</p>`,
    availableForSale: true,
    featuredImage: images[0],
    images,
    options,
    variants,
    priceRange: {
      minVariantPrice: money(seed.price),
      maxVariantPrice: money(seed.price),
    },
    compareAtPriceRange: seed.compareAt
      ? { minVariantPrice: money(seed.compareAt), maxVariantPrice: money(seed.compareAt) }
      : undefined,
    tags: seed.tags,
    universe: seed.universe,
    material: seed.material,
    badge: seed.badge,
  };
}

// ————————————————————————————————————————————————————————————————
// QAVIER ESSENTIALS — the live main store (internally the 'luxe' universe key)
// The T-shirt line that powers the home page rail.
// ————————————————————————————————————————————————————————————————
const TEE_SEEDS: SeedInput[] = [
  {
    handle: 'signature-q-tee',
    title: 'Signature Q Tee',
    tagline: 'Our everyday hero, embroidered Q.',
    description:
      'A heavyweight everyday tee in premium combed cotton with a subtle embroidered Q at the chest. Pre-shrunk and garment-dyed, built to keep its shape wash after wash.',
    price: 1799,
    universe: 'luxe',
    tags: ['t-shirts', 'bestseller', 'essentials'],
    material: '240gsm combed cotton',
    badge: 'Bestseller',
    colors: ['Noir', 'Sand', 'Chocolate'],
  },
  {
    handle: 'minimal-logo-tee',
    title: 'Minimal Logo Tee',
    tagline: 'Clean lines, quiet logo.',
    description:
      'A relaxed-fit tee with a tonal, minimal logo. Soft-washed for that worn-in feel from the very first day.',
    price: 1699,
    universe: 'luxe',
    tags: ['t-shirts', 'new', 'essentials'],
    material: '220gsm ring-spun cotton',
    badge: 'New',
    colors: ['Sand', 'Chocolate', 'Noir'],
  },
  {
    handle: 'classic-essential-tee',
    title: 'Classic Essential Tee',
    tagline: 'The one you reach for first.',
    description:
      'The Qavier classic — a true-to-size crew in breathable cotton. The foundation of every rotation.',
    price: 1699,
    universe: 'luxe',
    tags: ['t-shirts', 'essentials'],
    material: '200gsm cotton',
    colors: ['Chocolate', 'Noir', 'Stone'],
  },
  {
    handle: 'premium-q-tee',
    title: 'Premium Q Tee',
    tagline: 'Elevated weight, elevated feel.',
    description:
      'A premium boxy tee in dense pima cotton with a structured collar that holds its line all day.',
    price: 1899,
    universe: 'luxe',
    tags: ['t-shirts', 'bestseller', 'essentials'],
    material: '260gsm pima cotton',
    badge: 'Bestseller',
    colors: ['Forest', 'Noir', 'Stone'],
  },
  {
    handle: 'back-print-tee',
    title: 'Back Print Tee',
    tagline: 'Subtle front, statement back.',
    description:
      'A minimalist front with a considered back print. Drop-shoulder fit and a heavyweight hand-feel.',
    price: 1899,
    universe: 'luxe',
    tags: ['t-shirts', 'new', 'essentials'],
    material: '240gsm combed cotton',
    badge: 'New',
    colors: ['Stone', 'Noir', 'Chocolate'],
  },
];

// ————————————————————————————————————————————————————————————————
// QAVIER LUXE — quiet luxury (the premium line, currently "coming soon")
// ————————————————————————————————————————————————————————————————
const LUXE_SEEDS: SeedInput[] = [
  {
    handle: 'monolith-wool-coat',
    title: 'The Monolith Coat',
    tagline: 'Double-faced virgin wool, cut to a single clean line.',
    description:
      'An architectural overcoat in double-faced Italian virgin wool. Hand-finished seams, a concealed placket and a silhouette engineered to fall without a single break. The Monolith is the cornerstone of the Qavier wardrobe.',
    price: 1850,
    universe: 'luxe',
    tags: ['luxe', 'outerwear', 'icon'],
    material: '100% Virgin Wool, Italian milled',
    badge: 'Icon',
    colors: ['Noir', 'Camel', 'Ivory'],
    imageCount: 5,
  },
  {
    handle: 'atelier-silk-slip',
    title: 'Atelier Silk Slip',
    tagline: 'Bias-cut sandwashed silk that moves like water.',
    description:
      'A bias-cut slip dress in sandwashed mulberry silk, draped on the body and finished with French seams. Understated by daylight, luminous by candlelight.',
    price: 690,
    universe: 'luxe',
    tags: ['luxe', 'dresses', 'eveningwear'],
    material: '100% Mulberry Silk',
    colors: ['Champagne', 'Noir', 'Bordeaux'],
  },
  {
    handle: 'noir-cashmere-turtleneck',
    title: 'Noir Cashmere Turtleneck',
    tagline: 'Grade-A Mongolian cashmere, knitted to a second skin.',
    description:
      'A featherweight turtleneck in grade-A Mongolian cashmere. Fully fashioned, seamless at the shoulder, and warm without weight. The quiet luxury essential.',
    price: 520,
    universe: 'luxe',
    tags: ['luxe', 'knitwear', 'essential'],
    material: '100% Grade-A Cashmere',
    colors: ['Noir', 'Ivory', 'Stone'],
  },
  {
    handle: 'architect-tailored-trouser',
    title: 'Architect Trouser',
    tagline: 'A high-waisted column in tropical wool.',
    description:
      'High-waisted, single-pleated trousers in a fluid tropical wool. Drafted for a long, uninterrupted line from waist to hem. Tailoring as restraint.',
    price: 480,
    universe: 'luxe',
    tags: ['luxe', 'tailoring', 'trousers'],
    material: '98% Wool, 2% Elastane',
    colors: ['Charcoal', 'Noir', 'Taupe'],
  },
  {
    handle: 'ivory-structured-blazer',
    title: 'Ivory Structured Blazer',
    tagline: 'Sculpted shoulders, horn buttons, zero noise.',
    description:
      'A single-breasted blazer with a softly sculpted shoulder and hand-padded lapel. Cut from a dense ivory wool-silk and fastened with polished horn. Power, whispered.',
    price: 980,
    compareAt: 1180,
    universe: 'luxe',
    tags: ['luxe', 'tailoring', 'sale'],
    material: '70% Wool, 30% Silk',
    badge: 'Atelier',
    colors: ['Ivory', 'Noir'],
  },
  {
    handle: 'meridian-trench',
    title: 'The Meridian Trench',
    tagline: 'Water-repellent cotton gabardine, storm-ready, opera-bound.',
    description:
      'A reimagined trench in tightly woven cotton gabardine with a water-repellent finish. Storm flap, throat latch and a removable belt. Equally at home in a downpour or a foyer.',
    price: 1290,
    universe: 'luxe',
    tags: ['luxe', 'outerwear'],
    material: '100% Cotton Gabardine',
    colors: ['Sand', 'Noir'],
    imageCount: 5,
  },
  {
    handle: 'gilded-evening-gown',
    title: 'Gilded Evening Gown',
    tagline: 'Liquid satin with a hand-beaded champagne hem.',
    description:
      'A floor-sweeping column gown in liquid duchess satin, finished with a hand-beaded champagne hem worked over forty hours in the atelier. Reserved for the occasions that deserve it.',
    price: 2400,
    universe: 'luxe',
    tags: ['luxe', 'eveningwear', 'couture'],
    material: 'Duchess Satin, hand-beaded',
    badge: 'Made to Order',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Champagne', 'Noir'],
    imageCount: 6,
  },
  {
    handle: 'onyx-leather-gloves',
    title: 'Onyx Leather Gloves',
    tagline: 'Nappa leather, silk-lined, hand-stitched in Naples.',
    description:
      'Hand-stitched gloves in buttery Italian nappa leather with a whisper of silk lining. A final, deliberate gesture of polish.',
    price: 320,
    universe: 'luxe',
    tags: ['luxe', 'accessories'],
    material: 'Italian Nappa Leather, silk lining',
    sizes: ['6.5', '7', '7.5', '8'],
    colors: ['Onyx', 'Cognac'],
    imageCount: 3,
  },
];

// ————————————————————————————————————————————————————————————————
// QAVIER POPS — Gen-Z maximalism
// ————————————————————————————————————————————————————————————————
const POPS_SEEDS: SeedInput[] = [
  {
    handle: 'hyperpop-cargo-pants',
    title: 'HYPERPOP Cargos',
    tagline: 'Eleven pockets. Zero chill. Straps for days.',
    description:
      "Oversized parachute cargos with eleven (yes, ELEVEN) pockets, detachable straps and a drawcord hem you can cinch into oblivion. Built to be seen from space.",
    price: 88,
    compareAt: 110,
    universe: 'pops',
    tags: ['pops', 'bottoms', 'drop'],
    material: 'Recycled ripstop nylon',
    badge: 'BESTSELLER',
    colors: ['Acid', 'Cyber Black', 'Bubblegum'],
    imageCount: 4,
  },
  {
    handle: 'glitchcore-baby-tee',
    title: 'Glitchcore Baby Tee',
    tagline: 'Shrunken fit, screen-printed static, maximum chaos.',
    description:
      'A shrunken baby tee with a glitched-out screen print that looks like your screen crashed (on purpose). Soft, stretchy, and a little unhinged.',
    price: 38,
    universe: 'pops',
    tags: ['pops', 'tops', 'new'],
    material: 'Organic cotton / elastane',
    badge: 'NEW',
    colors: ['White', 'Lime', 'Hot Pink'],
  },
  {
    handle: 'acid-wash-bomber',
    title: 'Acid Wash Bomber',
    tagline: 'Reversible. Iridescent. Slightly radioactive energy.',
    description:
      'A reversible bomber with an iridescent acid-wash shell on one side and a fuzzy fleece on the other. Flip it depending on the vibe. Both sides slap.',
    price: 145,
    universe: 'pops',
    tags: ['pops', 'outerwear', 'drop'],
    material: 'Iridescent nylon / sherpa',
    badge: 'LIMITED',
    colors: ['Oil Slick', 'Toxic Green'],
    imageCount: 5,
  },
  {
    handle: 'y2k-mesh-top',
    title: 'Y2K Mesh Top',
    tagline: 'Sheer, sparkly, straight outta 2003.',
    description:
      "A long-sleeve mesh top with all-over micro-sparkle and a built-in bandeau. Layer it, don't, whatever — it understood the assignment.",
    price: 42,
    universe: 'pops',
    tags: ['pops', 'tops', 'y2k'],
    material: 'Sparkle mesh',
    colors: ['Cyber Pink', 'Electric Blue', 'Black'],
  },
  {
    handle: 'bubblegum-puffer',
    title: 'Bubblegum Puffer',
    tagline: 'Cloud-soft, marshmallow-thicc, impossible to ignore.',
    description:
      'A cropped puffer with a glossy ripstop shell and a hood you can disappear into. Recycled fill, marshmallow loft, certified head-turner.',
    price: 165,
    compareAt: 195,
    universe: 'pops',
    tags: ['pops', 'outerwear', 'sale'],
    material: 'Recycled ripstop / recycled fill',
    badge: 'SALE',
    colors: ['Bubblegum', 'Lime', 'Lavender'],
    imageCount: 4,
  },
  {
    handle: 'static-hoodie',
    title: 'STATIC Hoodie',
    tagline: 'Heavyweight fleece with puff-print everything.',
    description:
      'A 480gsm boxy hoodie with raised puff-print graphics across the chest and sleeves. Thick drawcords, kangaroo pocket, the comfiest thing you own (sorry to your old hoodie).',
    price: 95,
    universe: 'pops',
    tags: ['pops', 'tops', 'bestseller'],
    material: '480gsm cotton fleece',
    badge: 'CULT FAVE',
    colors: ['Violet', 'Black', 'Cream'],
    imageCount: 4,
  },
  {
    handle: 'rave-mini-skirt',
    title: 'Rave Mini Skirt',
    tagline: 'Pleated, reflective, built for the function.',
    description:
      'A micro-pleated mini with reflective piping that lights up under flash. Built-in shorts so you can dance like nobody (everybody) is filming.',
    price: 54,
    universe: 'pops',
    tags: ['pops', 'bottoms', 'new'],
    material: 'Reflective tech-pleat',
    badge: 'NEW',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Silver', 'Hot Pink', 'Black'],
  },
  {
    handle: 'cyber-platform-boots',
    title: 'Cyber Platform Boots',
    tagline: '3-inch stomp. Chunky buckles. Main-character energy.',
    description:
      'Vegan-leather platform boots with a 3-inch stomp sole, oversized buckles and a side zip. Heavy on the eyes, light on the planet.',
    price: 130,
    universe: 'pops',
    tags: ['pops', 'footwear', 'drop'],
    material: 'Vegan leather',
    badge: 'DROP',
    sizes: ['5', '6', '7', '8', '9', '10'],
    colors: ['Black', 'White', 'Chrome'],
    imageCount: 5,
  },
];

export const MOCK_PRODUCTS: Product[] = [
  ...TEE_SEEDS.map(buildProduct),
  ...LUXE_SEEDS.map(buildProduct),
  ...POPS_SEEDS.map(buildProduct),
];

export function mockProductsByUniverse(universe: Universe): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.universe === universe);
}

export function mockProductByHandle(handle: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.handle === handle);
}

const LUXE_COLLECTIONS: Collection[] = [
  {
    id: 'gid://qavier/Collection/qavier-luxe',
    handle: 'qavier-luxe',
    title: 'The Atelier Collection',
    description:
      'Quiet luxury, considered in every seam. Investment pieces built to outlive the season.',
    image: null,
    universe: 'luxe',
    products: mockProductsByUniverse('luxe'),
  },
];

const POPS_COLLECTIONS: Collection[] = [
  {
    id: 'gid://qavier/Collection/qavier-pops',
    handle: 'qavier-pops',
    title: 'The Drop',
    description: 'Loud, limited, and gone before you finish scrolling. This is Qavier Pops.',
    image: null,
    universe: 'pops',
    products: mockProductsByUniverse('pops'),
  },
];

export const MOCK_COLLECTIONS: Collection[] = [...LUXE_COLLECTIONS, ...POPS_COLLECTIONS];

export function mockCollectionByHandle(handle: string): Collection | undefined {
  const found = MOCK_COLLECTIONS.find((c) => c.handle === handle);
  if (found) return found;
  // Fall back to a universe-derived collection if a tag handle is requested.
  return undefined;
}
