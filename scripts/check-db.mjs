/**
 * Connectivity + schema check for the Supabase project.
 * Reads .env.local; prints which tables exist and their row counts.
 * Does NOT print secrets.   Run:  node scripts/check-db.mjs
 */
import { createClient } from '@supabase/supabase-js';
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
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}
console.log(`Connecting to ${url} ...`);
const db = createClient(url, key, { auth: { persistSession: false } });

const tables = [
  'admin_profiles', 'events', 'executives', 'achievements', 'collaborations',
  'faqs', 'moderator_messages', 'spotlights', 'gallery_photos', 'contributors',
  'organization_types', 'partnership_types', 'contact_info', 'membership_info',
  'content_submissions', 'audit_log', 'notifications', 'announcements',
  'contact_submissions', 'partnership_submissions', 'feedback',
];

let missing = 0;
for (const t of tables) {
  const { count, error } = await db.from(t).select('id', { count: 'exact' }).limit(1);
  if (error) { console.log(`  [MISSING] ${t}: ${error.message}`); missing++; }
  else console.log(`  [ok] ${t}: ${count} row(s)`);
}
console.log(
  missing
    ? `\n${missing} table(s) missing — run supabase/migrations/0001_init.sql in the SQL editor first.`
    : '\nAll tables present. Ready for data migration.'
);
