/**
 * Uploads content images referenced by DB rows (local /images/... paths) into
 * the Supabase Storage `media` bucket and rewrites those columns to the public
 * Storage URL. Idempotent: already-URL values are skipped; uploads use upsert.
 *
 * Run:  node scripts/migrate-images.mjs
 * Afterwards the migrated local files under public/images can be removed.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';

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

const BUCKET = 'media';
const CT = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.gif': 'image/gif',
};
const isLocal = (v) =>
  typeof v === 'string' && v.trim() !== '' && !/^https?:\/\//i.test(v) && /\.(png|jpe?g|webp|avif|svg|gif)$/i.test(v.trim());

const uploaded = new Map(); // localPath -> publicUrl|null
const migratedFiles = new Set();

async function up(local) {
  const keyPath = local.trim();
  if (uploaded.has(keyPath)) return uploaded.get(keyPath);
  const rel = keyPath.replace(/^\//, ''); // images/Event/1.jpg
  const file = join(ROOT, 'public', rel);
  if (!existsSync(file)) {
    console.warn('  missing file:', keyPath);
    uploaded.set(keyPath, null);
    return null;
  }
  const ext = extname(rel).toLowerCase();
  const buf = readFileSync(file);
  const { error } = await db.storage.from(BUCKET).upload(rel, buf, {
    contentType: CT[ext] || 'application/octet-stream',
    upsert: true,
  });
  if (error) {
    console.warn('  upload failed:', keyPath, error.message);
    uploaded.set(keyPath, null);
    return null;
  }
  const { data } = db.storage.from(BUCKET).getPublicUrl(rel);
  uploaded.set(keyPath, data.publicUrl);
  migratedFiles.add(rel);
  return data.publicUrl;
}
const mapVal = async (v) => (isLocal(v) ? (await up(v)) ?? v : v);

async function scalar(table, col) {
  const { data, error } = await db.from(table).select(`id, ${col}`);
  if (error) { console.warn(`  ${table}.${col}: ${error.message}`); return; }
  let n = 0;
  for (const r of data || []) {
    if (!isLocal(r[col])) continue;
    const u = await mapVal(r[col]);
    if (u && u !== r[col]) { await db.from(table).update({ [col]: u }).eq('id', r.id); n++; }
  }
  console.log(`  ${table}.${col}: ${n} updated`);
}

async function run() {
  console.log('Migrating images -> Supabase Storage...');

  // events: image_url (scalar) + gallery (text[]) + speakers[].image (jsonb)
  const { data: events } = await db.from('events').select('id, image_url, gallery, speakers');
  let ev = 0;
  for (const e of events || []) {
    const patch = {};
    if (isLocal(e.image_url)) patch.image_url = await mapVal(e.image_url);
    if (Array.isArray(e.gallery) && e.gallery.some(isLocal)) {
      const g = [];
      for (const p of e.gallery) g.push(await mapVal(p));
      patch.gallery = g;
    }
    if (Array.isArray(e.speakers) && e.speakers.some((s) => s && isLocal(s.image))) {
      const s = [];
      for (const sp of e.speakers) s.push({ ...sp, image: sp?.image ? await mapVal(sp.image) : sp?.image });
      patch.speakers = s;
    }
    if (Object.keys(patch).length) { await db.from('events').update(patch).eq('id', e.id); ev++; }
  }
  console.log(`  events: ${ev} updated`);

  await scalar('executives', 'img');
  await scalar('achievements', 'image');
  await scalar('collaborations', 'image');
  await scalar('spotlights', 'photo');
  await scalar('moderator_messages', 'image');
  await scalar('gallery_photos', 'image');

  const files = [...migratedFiles].sort();
  writeFileSync(join(ROOT, 'scripts', '.migrated-images.json'), JSON.stringify(files, null, 2));
  console.log(`\nUploaded ${files.length} unique file(s) to Storage. List saved to scripts/.migrated-images.json`);
  console.log('Done.');
}

run().catch((e) => { console.error('Image migration failed:', e.message); process.exit(1); });
