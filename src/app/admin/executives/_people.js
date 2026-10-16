/**
 * Aggregates "people already in the system" from every table that stores a
 * person's details, into the shape the executive reuse-picker consumes:
 *
 *   { name, img, email, facebook, linkedin, lastRole, lastYear, lastCommittee, source }
 *
 * Selecting a person in the picker prefills their name/photo/email/socials, so
 * someone known anywhere — a past executive, a contributor, a member spotlight,
 * a leadership message, or an admin login account — can be reused for a new
 * position without re-typing their details.
 *
 * Records for the same person are merged across sources: the first non-empty
 * value wins per field (sources are listed richest-first), so e.g. an admin
 * account (email, no photo) and a past-executive record (photo + socials, maybe
 * no email) fold into a single entry carrying both.
 *
 * Admin login accounts are only passed in for superadmins (they expose private
 * login emails); the page layer enforces that — see executives/new/page.jsx.
 */

const stripMailto = (s) => (s || '').replace(/^mailto:/i, '').trim();
const normEmail = (s) => stripMailto(s).toLowerCase();
const normName = (s) => (s || '').trim().toLowerCase().replace(/\s+/g, ' ');

/** Normalize any source row into the common person shape. */
function candidate(partial) {
  return {
    name: (partial.name || '').trim(),
    img: partial.img || '',
    email: stripMailto(partial.email),
    facebook: partial.facebook || '',
    linkedin: partial.linkedin || '',
    lastRole: partial.lastRole || '',
    lastYear: partial.lastYear ?? null,
    lastCommittee: partial.lastCommittee || '',
    source: partial.source || '',
  };
}

/** Fill empty fields of `dst` from `src` (first non-empty value wins). */
function mergeInto(dst, src) {
  for (const k of ['name', 'img', 'email', 'facebook', 'linkedin', 'lastRole', 'lastCommittee', 'source']) {
    if (!dst[k] && src[k]) dst[k] = src[k];
  }
  if (dst.lastYear == null && src.lastYear != null) dst.lastYear = src.lastYear;
}

const fromExecutives = (rows = []) =>
  rows.map((r) =>
    candidate({
      name: r.name,
      img: r.img,
      email: r.email,
      facebook: r.facebook,
      linkedin: r.linkedin,
      lastRole: r.role,
      lastYear: r.year,
      lastCommittee: r.committee,
      source: 'Executive',
    })
  );

const fromContributors = (rows = []) =>
  rows.map((r) =>
    candidate({
      name: r.name,
      img: r.avatar_url,
      email: r.email,
      facebook: r.facebook,
      linkedin: r.linkedin,
      lastRole: r.developer_type,
      source: 'Contributor',
    })
  );

const fromSpotlights = (rows = []) =>
  rows.map((r) =>
    candidate({
      name: r.name,
      img: r.photo,
      facebook: r.socials?.facebook,
      linkedin: r.socials?.linkedin,
      lastRole: r.role,
      source: 'Spotlight',
    })
  );

const fromModerators = (rows = []) =>
  rows.map((r) =>
    candidate({
      name: r.name,
      img: r.image,
      lastRole: r.title,
      source: 'Leadership message',
    })
  );

const fromAdmins = (rows = []) =>
  rows.map((r) =>
    candidate({
      name: r.full_name,
      email: r.email,
      lastRole: r.role === 'superadmin' ? 'Superadmin' : 'Data-entry admin',
      source: 'Admin account',
    })
  );

/**
 * Merge person records from every source into a deduped, name-sorted list.
 *
 * @param {{
 *   executives?: object[], contributors?: object[], spotlights?: object[],
 *   moderators?: object[], admins?: object[]
 * }} sources raw rows per table (admins already shaped { full_name, role, email })
 * @returns {object[]} merged people in the reuse-picker shape
 */
export function mergePeople(sources = {}) {
  // Richest position context first so it wins the merge.
  const all = [
    ...fromExecutives(sources.executives),
    ...fromContributors(sources.contributors),
    ...fromSpotlights(sources.spotlights),
    ...fromModerators(sources.moderators),
    ...fromAdmins(sources.admins),
  ].filter((c) => c.name || c.email); // need at least a name or an email to reuse

  // Identify each record: a record with an email is keyed by that email; an
  // email-less record folds into a same-name person who does have an email,
  // otherwise it stands on its own name. Two records with *different* emails stay
  // distinct even when their names match (different login = different person).
  const nameToEmailKey = new Map();
  for (const c of all) {
    if (!c.email) continue;
    const nk = normName(c.name);
    if (nk && !nameToEmailKey.has(nk)) nameToEmailKey.set(nk, normEmail(c.email));
  }
  const clusterId = (c) => {
    if (c.email) return `e:${normEmail(c.email)}`;
    const nk = normName(c.name);
    if (nk && nameToEmailKey.has(nk)) return `e:${nameToEmailKey.get(nk)}`;
    return `n:${nk}`;
  };

  // `all` is already in priority order, so the first record seen for a cluster is
  // the highest-priority one; later records only fill its empty fields. This is
  // what keeps a past-executive identity ahead of an admin account that merely
  // happens to carry the email.
  const clusters = new Map();
  for (const c of all) {
    const id = clusterId(c);
    const existing = clusters.get(id);
    if (existing) mergeInto(existing, c);
    else clusters.set(id, { ...c });
  }

  return [...clusters.values()].sort((a, b) =>
    (a.name || a.email).localeCompare(b.name || b.email)
  );
}
