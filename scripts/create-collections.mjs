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
 *   SHOPIFY_API_VERSION         optional, default 2024-07
 *
 * Safe to re-run: a handle that already exists is reported and left alone —
 * this script never edits or deletes a collection.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

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
const VERSION = process.env.SHOPIFY_API_VERSION || '2024-07';

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

console.log(`${APPLY ? 'Creating' : 'Dry run —'} ${defs.length} collections on ${DOMAIN} (API ${VERSION})\n`);

const publications = PUBLISH ? await choosePublications() : [];
if (PUBLISH) {
  console.log(
    publications.length
      ? `Publishing to: ${publications.map((p) => p.name).join(', ')}\n`
      : 'No matching sales channels — collections will be created unpublished.\n',
  );
}

const results = { created: [], exists: [], planned: [], failed: [] };

for (const def of defs) {
  const existing = await findByHandle(def.handle);
  if (existing) {
    results.exists.push(def.handle);
    console.log(`  = ${def.handle.padEnd(28)} already exists — left as is`);
    continue;
  }

  if (!APPLY) {
    results.planned.push(def.handle);
    console.log(`  + ${def.handle.padEnd(28)} ${describe(def)}`);
    continue;
  }

  try {
    const id = await createCollection(def);
    if (publications.length) await publish(id, publications);
    results.created.push(def.handle);
    console.log(`  ✓ ${def.handle.padEnd(28)} created${publications.length ? ' and published' : ''}`);
  } catch (err) {
    results.failed.push(def.handle);
    console.log(`  ✗ ${def.handle.padEnd(28)} ${err.message}`);
  }
}

console.log(
  `\n${results.created.length} created · ${results.exists.length} already existed` +
    (APPLY ? '' : ` · ${results.planned.length} would be created`) +
    (results.failed.length ? ` · ${results.failed.length} failed` : ''),
);
if (!APPLY && results.planned.length) console.log('Run again with --apply to create them.');
process.exitCode = results.failed.length ? 1 : 0;

// ——— Shopify calls ————————————————————————————————————————————————————

async function findByHandle(handle) {
  const data = await admin(
    `query findCollection($query: String!) {
      collections(first: 5, query: $query) { nodes { id handle } }
    }`,
    { query: `handle:${handle}` },
  );
  return data.collections.nodes.find((c) => c.handle === handle) ?? null;
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
  if (collection.handle !== def.handle) {
    // Shopify de-duplicates handles silently (e.g. "men-1"); the storefront
    // looks collections up by the exact handle, so say so loudly.
    console.log(`    ! Shopify saved this as "${collection.handle}" — rename it to "${def.handle}"`);
  }
  return collection.id;
}

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
  if (errors?.length) throw new Error(`created, but publishing failed: ${errors.map((e) => e.message).join('; ')}`);
}

async function choosePublications() {
  const data = await admin(`query publications { publications(first: 50) { nodes { id name } } }`);
  const all = data.publications.nodes;
  if (!PUBLICATION_FILTERS.length) return all;
  return all.filter((p) => PUBLICATION_FILTERS.some((f) => p.name.toLowerCase().includes(f)));
}

/** POST to the Admin API, retrying when Shopify throttles the request. */
async function admin(query, variables = {}) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN },
      body: JSON.stringify({ query, variables }),
    });

    if (res.status === 429) {
      await sleep(1000 * 2 ** attempt);
      continue;
    }
    if (!res.ok) {
      const text = await res.text();
      fail(`Shopify Admin API HTTP ${res.status}: ${text.slice(0, 300)}`);
    }

    const body = await res.json();
    const throttled = body.errors?.some((e) => e.extensions?.code === 'THROTTLED');
    if (throttled) {
      await sleep(1000 * 2 ** attempt);
      continue;
    }
    if (body.errors?.length) {
      const msg = body.errors.map((e) => e.message).join('; ');
      if (/access denied|scope/i.test(msg)) {
        fail(`${msg}\nCheck the Admin token has write_products, read_publications and write_publications.`);
      }
      throw new Error(msg);
    }
    return body.data;
  }
  throw new Error('Shopify kept throttling the request — try again in a minute.');
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

function valuesOf(flag) {
  const out = [];
  argv.forEach((a, i) => {
    if (a === flag && argv[i + 1] && !argv[i + 1].startsWith('--')) out.push(argv[i + 1]);
    else if (a.startsWith(`${flag}=`)) out.push(a.slice(flag.length + 1));
  });
  return out;
}

/** Minimal KEY=VALUE reader; never overrides variables already set. */
function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (!m || line.trim().startsWith('#')) continue;
    const value = m[2].replace(/^(['"])(.*)\1$/, '$2');
    if (process.env[m[1]] === undefined) process.env[m[1]] = value;
  }
}

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function fail(message) {
  console.error(`\n${message}\n`);
  process.exit(1);
}
