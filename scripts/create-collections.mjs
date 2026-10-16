#!/usr/bin/env node
/**
 * Create the storefront's collections in Shopify.
 *
 * Reads lib/catalog/collections.json and creates each collection as a smart
 * collection (filled automatically by its tag / product-type rules), then
 * publishes it to your sales channels so the storefront can read it.
 *
 *   node scripts/create-collections.mjs            # dry run: shows the plan
 *   node scripts/create-collections.mjs --apply    # creates what's missing
 *
 * Options:
 *   --apply                 actually create and publish (default is a dry run)
 *   --only a,b,c            limit to these handles
 *   --publication <text>    publish only to channels whose name contains this
 *                           text (repeatable); default: every channel
 *   --no-publish            create without publishing
 *
 * Needs, in the environment or in .env.local / .env:
 *   SHOPIFY_STORE_DOMAIN        your-store.myshopify.com
 *   SHOPIFY_ADMIN_ACCESS_TOKEN  Admin API token (shpat_…) from a custom app with
 *                               write_products, read_publications and
 *                               write_publications scopes
 *   SHOPIFY_ADMIN_API_VERSION   optional, default 2024-07
 *
 * Safe to re-run: a handle that already exists is never edited or deleted.
 * With --apply it is (re)published to the chosen channels, so a run that
 * failed to publish can simply be repeated.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** An error that should stop the whole run, not just one collection. */
class FatalError extends Error {}

// ——— Config ————————————————————————————————————————————————————————

loadEnvFile(path.join(ROOT, '.env.local'));
loadEnvFile(path.join(ROOT, '.env'));

const argv = process.argv.slice(2);
const APPLY = argv.includes('--apply');
const PUBLISH = !argv.includes('--no-publish');
const ONLY = valuesOf('--only').flatMap((v) => v.split(',')).map((s) => s.trim()).filter(Boolean);
const PUBLICATION_FILTERS = valuesOf('--publication').map((s) => s.toLowerCase());

const DOMAIN = (process.env.SHOPIFY_STORE_DOMAIN ?? '').replace(/^https?:\/\//, '').replace(/\/$/, '');
const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ?? '';
// The Admin API version is pinned separately from the storefront's
// SHOPIFY_API_VERSION: the lookup below uses collectionByHandle, which newer
// Admin versions replace.
const VERSION = process.env.SHOPIFY_ADMIN_API_VERSION || '2024-07';

const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/catalog/collections.json'), 'utf8'));
const defs = catalog.collections.filter((d) => !ONLY.length || ONLY.includes(d.handle));

if (ONLY.length) {
  const unknown = ONLY.filter((h) => !catalog.collections.some((d) => d.handle === h));
  if (unknown.length) fail(`Unknown handle(s) in --only: ${unknown.join(', ')}`);
}
if (!DOMAIN || !TOKEN) {
  fail(
    'Set SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN (in the environment or .env.local).\n' +
      'The Admin token comes from Settings → Apps and sales channels → Develop apps → your app →\n' +
      'API credentials, with the write_products, read_publications and write_publications scopes.',
  );
}

const ENDPOINT = `https://${DOMAIN}/admin/api/${VERSION}/graphql.json`;

// ——— Run ——————————————————————————————————————————————————————————

try {
  await run();
} catch (err) {
  fail(err instanceof Error ? err.message : String(err));
}

async function run() {
  console.log(`${APPLY ? 'Creating' : 'Dry run —'} ${defs.length} collections on ${DOMAIN} (Admin API ${VERSION})\n`);

  const publications = PUBLISH ? await choosePublications() : [];
  if (PUBLISH) console.log(`Publishing to: ${publications.map((p) => p.name).join(', ')}\n`);

  const results = { created: [], exists: [], planned: [], failed: [] };

  for (const def of defs) {
    const name = def.handle.padEnd(28);
    try {
      const existing = await findByHandle(def.handle);

      if (existing) {
        results.exists.push(def.handle);
        if (APPLY && publications.length) {
          await publish(existing.id, publications);
          console.log(`  = ${name} already exists — published to the channels above`);
        } else {
          console.log(`  = ${name} already exists — left as is`);
        }
        continue;
      }

      if (!APPLY) {
        results.planned.push(def.handle);
        console.log(`  + ${name} ${describe(def)}`);
        continue;
      }

      const created = await createCollection(def);
      if (publications.length) await publish(created.id, publications);

      if (created.handle !== def.handle) {
        // Shopify de-duplicates handles silently (e.g. "men-1"); the
        // storefront looks collections up by the exact handle.
        results.failed.push(def.handle);
        console.log(
          `  ✗ ${name} created as "${created.handle}" — rename its handle to "${def.handle}" in Shopify`,
        );
        continue;
      }

      results.created.push(def.handle);
      console.log(`  ✓ ${name} created${publications.length ? ' and published' : ''}`);
    } catch (err) {
      if (err instanceof FatalError) throw err;
      results.failed.push(def.handle);
      console.log(`  ✗ ${name} ${err.message}`);
    }
  }

  console.log(
    `\n${results.created.length} created · ${results.exists.length} already existed` +
      (APPLY ? '' : ` · ${results.planned.length} would be created`) +
      (results.failed.length ? ` · ${results.failed.length} failed (${results.failed.join(', ')})` : ''),
  );
  if (!APPLY && results.planned.length) console.log('Run again with --apply to create them.');
  process.exitCode = results.failed.length ? 1 : 0;
}

// ——— Shopify calls ————————————————————————————————————————————————————

/** Exact lookup by handle — no search index, so no lag and no fuzzy matches. */
async function findByHandle(handle) {
  const data = await admin(
    `query findCollection($handle: String!) {
      collectionByHandle(handle: $handle) { id handle }
    }`,
    { handle },
  );
  return data.collectionByHandle;
}

async function createCollection(def) {
  const data = await admin(
    `mutation createCollection($input: CollectionInput!) {
      collectionCreate(input: $input) {
        collection { id handle }
        userErrors { field message }
      }
    }`,
    {
      input: {
        title: def.title,
        handle: def.handle,
        ...(def.description ? { descriptionHtml: `<p>${escapeHtml(def.description)}</p>` } : {}),
        sortOrder: def.sortOrder,
        ruleSet: {
          appliedDisjunctively: def.match === 'any',
          rules: def.rules.map(({ column, relation, condition }) => ({ column, relation, condition })),
        },
      },
    },
  );
  const { collection, userErrors } = data.collectionCreate;
  if (userErrors?.length) throw new Error(userErrors.map((e) => e.message).join('; '));
  if (!collection) throw new Error('Shopify returned no collection');
  return collection;
}

/** Publishing is idempotent — a channel that already has it is unchanged. */
async function publish(id, pubs) {
  const data = await admin(
    `mutation publishCollection($id: ID!, $input: [PublicationInput!]!) {
      publishablePublish(id: $id, input: $input) {
        userErrors { field message }
      }
    }`,
    { id, input: pubs.map((p) => ({ publicationId: p.id })) },
  );
  const errors = data.publishablePublish.userErrors;
  if (errors?.length) throw new Error(`publishing failed: ${errors.map((e) => e.message).join('; ')}`);
}

async function choosePublications() {
  const data = await admin(`query publications { publications(first: 50) { nodes { id name } } }`);
  const all = data.publications.nodes;
  if (!PUBLICATION_FILTERS.length) {
    if (!all.length) throw new FatalError('This store has no sales channels to publish to.');
    return all;
  }
  const chosen = all.filter((p) => PUBLICATION_FILTERS.some((f) => p.name.toLowerCase().includes(f)));
  if (!chosen.length) {
    throw new FatalError(
      `No sales channel matches --publication ${PUBLICATION_FILTERS.join(', ')}.\n` +
        `Channels in this store: ${all.map((p) => p.name).join(', ') || '(none)'}`,
    );
  }
  return chosen;
}

/**
 * POST to the Admin API. Throttling (429 or a THROTTLED error) and Shopify
 * server errors (5xx) are retried with backoff, honouring Retry-After.
 * Permission and authentication problems stop the whole run.
 */
async function admin(query, variables = {}) {
  const ATTEMPTS = 5;
  let lastProblem = '';

  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    let res;
    try {
      res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN },
        body: JSON.stringify({ query, variables }),
      });
    } catch (err) {
      lastProblem = `network error: ${err.message}`;
      if (attempt < ATTEMPTS) await backoff(attempt);
      continue;
    }

    if (res.status === 429 || res.status >= 500) {
      lastProblem = `HTTP ${res.status}`;
      if (attempt < ATTEMPTS) await backoff(attempt, res.headers.get('retry-after'));
      continue;
    }
    if (res.status === 401 || res.status === 403) {
      throw new FatalError(
        `Shopify refused the token (HTTP ${res.status}): ${(await res.text()).slice(0, 200)}\n` +
          'Check SHOPIFY_ADMIN_ACCESS_TOKEN and the app’s scopes.',
      );
    }
    if (!res.ok) throw new FatalError(`Shopify Admin API HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);

    const body = await res.json();
    if (body.errors?.some((e) => e.extensions?.code === 'THROTTLED')) {
      lastProblem = 'throttled';
      if (attempt < ATTEMPTS) await backoff(attempt);
      continue;
    }
    if (body.errors?.length) {
      const msg = body.errors.map((e) => e.message).join('; ');
      if (/access denied|scope/i.test(msg)) {
        throw new FatalError(
          `${msg}\nCheck the Admin token has write_products, read_publications and write_publications.`,
        );
      }
      throw new Error(msg);
    }
    return body.data;
  }

  throw new Error(`Shopify kept failing (${lastProblem}) — try again in a minute.`);
}

// ——— Helpers ————————————————————————————————————————————————————————

function describe(def) {
  const join = def.match === 'any' ? ' OR ' : ' AND ';
  const rule = (r) => {
    const col = { TAG: 'tag', TYPE: 'type', VARIANT_PRICE: 'price', VARIANT_COMPARE_AT_PRICE: 'compare-at price' }[r.column] ?? r.column;
    const rel = { EQUALS: 'is', CONTAINS: 'contains', GREATER_THAN: '>', LESS_THAN: '<' }[r.relation] ?? r.relation;
    return `${col} ${rel} "${r.condition}"`;
  };
  return `"${def.title}" — ${def.rules.map(rule).join(join)}`;
}

/** Values for a repeatable `--flag value` / `--flag=value`; a bare flag is an error. */
function valuesOf(flag) {
  const out = [];
  argv.forEach((a, i) => {
    if (a === flag) {
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) fail(`${flag} needs a value, e.g. ${flag} ${flag === '--only' ? 'men,sale' : 'headless'}`);
      out.push(next);
    } else if (a.startsWith(`${flag}=`)) {
      const value = a.slice(flag.length + 1);
      if (!value) fail(`${flag}= needs a value`);
      out.push(value);
    }
  });
  return out;
}

/**
 * Minimal .env reader: `KEY=value`, optional `export `, quoted values, and
 * `# comments` after unquoted values. Never overrides variables already set.
 */
function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (line.trim().startsWith('#')) continue;
    const m = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/.exec(line);
    if (!m) continue;
    const raw = m[2];
    const quoted = /^(['"])(.*)\1$/.exec(raw);
    const value = quoted ? quoted[2] : raw.replace(/\s+#.*$/, '');
    if (process.env[m[1]] === undefined) process.env[m[1]] = value;
  }
}

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}

function backoff(attempt, retryAfter) {
  const seconds = Number(retryAfter);
  const ms = Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : 1000 * 2 ** (attempt - 1);
  return new Promise((r) => setTimeout(r, Math.min(ms, 30_000)));
}

function fail(message) {
  console.error(`\n${message}\n`);
  process.exit(1);
}
