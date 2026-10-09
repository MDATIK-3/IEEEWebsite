/**
 * One-time data migration: static JSON (src/data) -> Supabase tables.
 *
 * Prereqs: run supabase/migrations/0001_init.sql first, and have
 *   NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
 *
 * Run from the project root:   node scripts/migrate-data.mjs
 * It clears each content table, then inserts the transformed rows (idempotent;
 * safe to re-run). Uses the service-role key, so it bypasses RLS.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const DATA = join(ROOT, 'src', 'data');

// ---- minimal .env.local loader (no dependency) ----------------------
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
const db = createClient(url, key, { auth: { persistSession: false } });

// ---- helpers --------------------------------------------------------
const json = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));
const img = (p) => (!p ? null : /^https?:\/\//.test(p) ? p : p.startsWith('/') ? p : `/${p}`);

// "2025-09-03" + "10:00 PM" (+Asia/Dhaka, always +06:00) -> ISO string
function toTs(date, time) {
  if (!date) return null;
  let hh = 0, mm = 0;
  if (time) {
    const m = String(time).match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (m) {
      hh = parseInt(m[1], 10);
      mm = parseInt(m[2], 10);
      const ap = (m[3] || '').toUpperCase();
      if (ap === 'PM' && hh < 12) hh += 12;
      if (ap === 'AM' && hh === 12) hh = 0;
    }
  }
  const iso = `${date}T${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:00+06:00`;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d.toISOString();
}
const asDate = (s) => {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

async function reset(table) {
  const { error } = await db.from(table).delete().not('id', 'is', null);
  if (error) throw new Error(`clear ${table}: ${error.message}`);
}
async function load(table, rows) {
  if (!rows.length) return console.log(`  ${table}: (no rows)`);
  const { error } = await db.from(table).insert(rows);
  if (error) throw new Error(`insert ${table}: ${error.message}`);
  console.log(`  ${table}: ${rows.length}`);
}

// ---- transforms -----------------------------------------------------
async function run() {
  console.log('Migrating JSON -> Supabase...');

  // events
  {
    const rows = json('eventData.json').map((e) => ({
      title: e.eventName,
      description: e.description,
      event_type: e.eventType,
      organizer: e.organizer,
      starts_at: toTs(e.date, e.startTime || e.time),
      ends_at: (() => {
        const s = toTs(e.date, e.startTime || e.time);
        let en = toTs(e.date, e.endTime);
        if (s && en && new Date(en) <= new Date(s)) en = new Date(new Date(en).getTime() + 864e5).toISOString();
        return en;
      })(),
      timezone: e.timezone || 'Asia/Dhaka',
      location_label: e.locationLabel || e.eventArea,
      event_area: e.eventArea,
      participant: e.participant ?? null,
      image_url: img(e.image),
      registration_link: e.registrationLink,
      guest: e.guest, guest_bio: e.guestBio,
      special_guest: e.specialGuest, special_guest_bio: e.specialGuestBio,
      speakers: (e.speakers || []).map((s) => ({ ...s, image: img(s.image) })),
      resources: e.resources || [],
      highlights: e.highlights || [],
      gallery: (e.gallery || []).map(img),
      is_published: true,
    }));
    await reset('events'); await load('events', rows);
  }

  // executives (flatten year -> committee -> group -> person)
  {
    const data = json('executiveData.json');
    const rows = [];
    for (const [year, committees] of Object.entries(data)) {
      for (const [committee, groups] of Object.entries(committees)) {
        for (const group of ['faculty', 'students']) {
          (groups[group] || []).forEach((p, i) => rows.push({
            year: parseInt(year, 10),
            committee,
            member_group: group === 'students' ? 'student' : 'faculty',
            name: p.name, role: p.role, img: img(p.img),
            facebook: p.social?.facebook, linkedin: p.social?.linkedin, email: p.social?.email,
            sort_order: i,
          }));
        }
      }
    }
    await reset('executives'); await load('executives', rows);
  }

  // achievements
  await reset('achievements');
  await load('achievements', json('acievement.json').map((a) => ({
    year: a.year, program_name: a.program_name, details: a.details, image: img(a.image),
  })));

  // collaborations (dedupe by name)
  {
    const seen = new Set();
    const rows = json('collaboration.json').filter((c) => {
      const k = (c.name || '').trim().toLowerCase();
      if (seen.has(k)) return false; seen.add(k); return true;
    }).map((c) => ({ name: c.name, organization: c.organization, image: img(c.image) }));
    await reset('collaborations'); await load('collaborations', rows);
  }

  // faqs (general + membership)
  {
    const general = json('FAQ.json').map((f, i) => ({ category: 'general', question: f.question, answer: f.answer, sort_order: i }));
    const mem = (json('membership.json').faqs || []).map((f, i) => ({ category: 'membership', question: f.question, answer: f.answer, sort_order: i }));
    await reset('faqs'); await load('faqs', [...general, ...mem]);
  }

  // moderator messages
  await reset('moderator_messages');
  await load('moderator_messages', json('moderatorsMessages.json').map((m, i) => ({
    name: m.name, title: m.title, image: img(m.image), message: m.message, sort_order: i,
  })));

  // spotlights
  await reset('spotlights');
  await load('spotlights', json('spotlights.json').map((s) => ({
    name: s.name, role: s.role, quote: s.quote, photo: img(s.photo), socials: s.socials || {},
  })));

  // gallery photos
  await reset('gallery_photos');
  await load('gallery_photos', json('photos.json').map((p) => ({
    image: img(p.image), name: p.name, taken_on: asDate(p.date),
  })));

  // contributors (from ContributionRoles.json; developerData.json is superseded)
  await reset('contributors');
  await load('contributors', json('ContributionRoles.json').map((c) => ({
    login: c.login, name: c.name || null, developer_type: c.developer_type, batch: c.batch,
    facebook: c.facebook, linkedin: c.linkedin, github: c.github, email: c.email,
    avatar_url: c.avatar_url, bio: c.bio,
  })));

  // partnership-form lookups
  await reset('organization_types');
  await load('organization_types', json('CollaborationForm/organizationTypes.json').map((o, i) => ({ value: o.value, label: o.label, sort_order: i })));
  await reset('partnership_types');
  await load('partnership_types', json('CollaborationForm/partnershipTypes.json').map((o, i) => ({ value: o.value, label: o.label, sort_order: i })));

  // contact info cards
  await reset('contact_info');
  await load('contact_info', json('contactInfo.json').map((c, i) => ({ icon: c.icon, title: c.title, primary_value: c.primary, sort_order: i })));

  // membership info (singleton)
  {
    const m = json('membership.json');
    const { error } = await db.from('membership_info').upsert({
      id: 1, join_link: m.joinLink, local_contact_link: m.localContactLink,
      benefits: m.benefits || [], steps: m.steps || [], fees: m.fees || [], faqs: m.faqs || [],
    });
    if (error) throw new Error(`membership_info: ${error.message}`);
    console.log('  membership_info: 1');
  }

  console.log('Done.');
}

run().catch((e) => { console.error('\nMigration failed:', e.message); process.exit(1); });
