import crypto from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

/**
 * On-demand revalidation for Shopify catalogue changes.
 *
 * Catalogue reads are cached (see SHOPIFY_REVALIDATE_SECONDS), so without this
 * a price edit in the Shopify admin only reaches the storefront when the window
 * lapses. Point a Shopify webhook here and edits land within a second or two.
 *
 * Shopify → Settings → Notifications → Webhooks. Create one per topic
 * (products/create, products/update, products/delete, collections/update) with
 * the URL:
 *
 *     https://<your-domain>/api/revalidate
 *
 * and set SHOPIFY_WEBHOOK_SECRET to the signing secret Shopify shows you, so
 * the HMAC can be verified.
 *
 * A manual flush is also possible when SHOPIFY_REVALIDATE_SECRET is set:
 *
 *     curl -X POST "https://<your-domain>/api/revalidate?secret=<secret>"
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;
const MANUAL_SECRET = process.env.SHOPIFY_REVALIDATE_SECRET;

/** Constant-time compare of two base64 HMACs. */
function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

function verifyShopifyHmac(rawBody: string, header: string | null) {
  if (!WEBHOOK_SECRET || !header) return false;
  const digest = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody, 'utf8')
    .digest('base64');
  return safeEqual(digest, header);
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const topic = request.headers.get('x-shopify-topic') ?? 'manual';
  const secret = new URL(request.url).searchParams.get('secret');

  const authorized =
    verifyShopifyHmac(rawBody, request.headers.get('x-shopify-hmac-sha256')) ||
    Boolean(MANUAL_SECRET && secret && safeEqual(secret, MANUAL_SECRET));

  if (!authorized) {
    // Missing config is the common case here — say so rather than failing mute.
    const reason =
      WEBHOOK_SECRET || MANUAL_SECRET
        ? 'Invalid signature.'
        : 'Set SHOPIFY_WEBHOOK_SECRET (or SHOPIFY_REVALIDATE_SECRET) to enable revalidation.';
    return NextResponse.json({ revalidated: false, reason }, { status: 401 });
  }

  const tags = new Set<string>();
  if (topic.startsWith('collections/')) {
    tags.add('collections');
    // A collection change can reorder/repopulate the grids that read products.
    tags.add('products');
  } else {
    tags.add('products');
    tags.add('collections');
  }

  // Product payloads carry the handle — flush that product's page precisely too.
  try {
    const payload = rawBody ? JSON.parse(rawBody) : null;
    if (payload?.handle && typeof payload.handle === 'string') {
      tags.add(
        topic.startsWith('collections/')
          ? `collection:${payload.handle}`
          : `product:${payload.handle}`,
      );
    }
  } catch {
    /* non-JSON body (manual flush) — the broad tags above still apply */
  }

  for (const tag of tags) revalidateTag(tag);

  return NextResponse.json({
    revalidated: true,
    topic,
    tags: [...tags],
    now: Date.now(),
  });
}
