/**
 * Pushes supabase/migrations/0001_init.sql to the Supabase Postgres DB over a
 * direct connection (uses DB_PASSWORD from .env.local). One-off; run once.
 *   node scripts/push-schema.mjs
 */
import pg from 'pg';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
function loadEnv() {
  const p = join(ROOT, '.env.local');
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const password = process.env.DB_PASSWORD || process.env.SUPABASE_DB_PASSWORD;
if (!url || !password) {
  console.error('Need NEXT_PUBLIC_SUPABASE_URL and DB_PASSWORD in .env.local');
  process.exit(1);
}
const ref = new URL(url).hostname.split('.')[0];
const sql = readFileSync(join(ROOT, 'supabase', 'migrations', '0001_init.sql'), 'utf8');

const hosts = [
  { host: `db.${ref}.supabase.co`, port: 5432, user: 'postgres' },
  // pooler fallbacks (IPv4) across common regions
  ...['ap-southeast-1', 'ap-south-1', 'us-east-1', 'us-west-1', 'eu-central-1', 'ap-southeast-2'].map(
    (r) => ({ host: `aws-0-${r}.pooler.supabase.com`, port: 5432, user: `postgres.${ref}` })
  ),
];

async function tryHost(h) {
  const client = new pg.Client({
    host: h.host, port: h.port, user: h.user, password, database: 'postgres',
    ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 12000,
  });
  await client.connect();
  console.log(`Connected via ${h.host}. Running migration...`);
  await client.query(sql);
  await client.query("NOTIFY pgrst, 'reload schema';");
  await client.end();
}

let ok = false;
for (const h of hosts) {
  try {
    await tryHost(h);
    ok = true;
    console.log('Schema pushed + PostgREST reload notified.');
    break;
  } catch (e) {
    console.log(`  ${h.host} -> ${e.code || e.message}`);
  }
}
process.exit(ok ? 0 : 2);
