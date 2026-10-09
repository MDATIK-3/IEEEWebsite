/**
 * One-time admin setup (service role):
 *   - create (or find) the superadmin auth user and mark it superadmin
 *   - create the public 'media' storage bucket for uploads
 *
 * Run:  ADMIN_EMAIL=you@x.com ADMIN_PASSWORD='temp-pass' node scripts/setup-admin.mjs
 * (ADMIN_EMAIL defaults to EMAIL_USER from .env.local; a random password is
 *  generated if ADMIN_PASSWORD is omitted and the user doesn't already exist.)
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';

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
if (!url || !key) { console.error('Missing Supabase env'); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false } });

const email = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
const password = process.env.ADMIN_PASSWORD || randomBytes(9).toString('base64url');
if (!email) { console.error('Set ADMIN_EMAIL or EMAIL_USER'); process.exit(1); }

let userId;
const { data: created, error } = await db.auth.admin.createUser({ email, password, email_confirm: true });
if (created?.user) {
  userId = created.user.id;
  console.log(`Created auth user ${email}`);
  console.log(`  TEMP PASSWORD: ${password}   (change it after first login)`);
} else {
  const { data: list } = await db.auth.admin.listUsers();
  const u = list?.users?.find((x) => x.email === email);
  if (!u) { console.error('Could not create or find user:', error?.message); process.exit(1); }
  userId = u.id;
  console.log(`Auth user ${email} already exists (password unchanged).`);
}

const { error: pe } = await db.from('admin_profiles').upsert({
  id: userId, full_name: 'Site Owner', role: 'superadmin', is_active: true,
});
console.log(pe ? `admin_profiles: ${pe.message}` : `Set ${email} as superadmin.`);

const { error: be } = await db.storage.createBucket('media', {
  public: true,
  fileSizeLimit: '10MB',
  allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/svg+xml'],
});
console.log(be ? `bucket media: ${be.message}` : 'Created public bucket "media".');
console.log('Done.');
