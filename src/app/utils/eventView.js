// Adapts a Supabase `events` row (snake_case columns + ISO timestamps) into the
// legacy view shape the event UI already consumes (camelCase fields + wall-clock
// date/time strings in the event's own timezone). The data moved from
// eventData.json to the database, but every event card, the detail sections and
// the calendar helpers still expect this shape, so adapting at the server
// boundary keeps them working unchanged.

const DEFAULT_TZ = 'Asia/Dhaka';

// ISO timestamp -> "YYYY-MM-DD" in the given timezone (en-CA formats this way).
function fmtDate(iso, tz) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

// ISO timestamp -> "hh:mm AM/PM" in the given timezone. Built from parts so the
// separator is always a plain space (some ICU builds use a narrow no-break
// space), matching the strings the old JSON stored.
function fmtTime(iso, tz) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(d);
  const get = (type) => parts.find((p) => p.type === type)?.value ?? '';
  const hour = get('hour');
  if (!hour) return '';
  return `${hour}:${get('minute')} ${get('dayPeriod').toUpperCase()}`.trim();
}

export function toEventView(row) {
  if (!row) return null;
  const tz = row.timezone || DEFAULT_TZ;
  const startTime = fmtTime(row.starts_at, tz);
  return {
    id: row.id,
    image: row.image_url || '',
    eventName: row.title || 'Untitled Event',
    description: row.description || '',
    date: fmtDate(row.starts_at, tz),
    time: startTime,
    startTime,
    endTime: fmtTime(row.ends_at, tz),
    guest: row.guest || '',
    guestBio: row.guest_bio || '',
    specialGuest: row.special_guest || '',
    specialGuestBio: row.special_guest_bio || '',
    eventArea: row.event_area || '',
    eventType: row.event_type || '',
    participant: row.participant ?? null,
    organizer: row.organizer || '',
    speakers: Array.isArray(row.speakers) ? row.speakers : [],
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    registrationLink: row.registration_link || '',
    timezone: tz,
    locationLabel: row.location_label || '',
    resources: Array.isArray(row.resources) ? row.resources : [],
  };
}

export function toEventViews(rows) {
  return (Array.isArray(rows) ? rows : []).map(toEventView).filter(Boolean);
}
