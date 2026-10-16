import { getExecutives } from '@/lib/queries';
import ExecutivesClient from './ExecutivesClient';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Executive Committee',
  description:
    'Meet the faculty advisors, office bearers and student leaders of the IEEE Student Branch and its chapters at Green University of Bangladesh (IEEE GUB).',
  path: '/Executives',
});

// Match the cached getter's revalidate window; admin writes call
// revalidateTag(TAGS.executives) to refresh this page instantly.
export const revalidate = 86400;

// Canonical committee order for the sidebar (unknown codes sort last).
const COMMITTEE_ORDER = ['SB', 'CS', 'PES', 'MAIN'];

/**
 * Reshape the flat `executives` rows (RLS already limits them to published) into
 * the nested structure the client expects:
 *   { [year]: { [committee]: { faculty: Member[], students: Member[] } } }
 *
 * Emails are normalized to a bare address (the UI builds `mailto:${email}`), and
 * every member carries a `social` object since MemberCard reads it unguarded.
 */
function groupExecutives(rows) {
  const byYear = {};

  for (const r of rows) {
    const year = String(r.year);
    const committee = r.committee || 'MAIN';
    const groupKey = r.member_group === 'faculty' ? 'faculty' : 'students';

    if (!byYear[year]) byYear[year] = {};
    if (!byYear[year][committee]) byYear[year][committee] = { faculty: [], students: [] };

    byYear[year][committee][groupKey].push({
      name: r.name,
      role: r.role ?? '',
      img: r.img ?? '',
      social: {
        facebook: r.facebook || null,
        linkedin: r.linkedin || null,
        email: r.email ? r.email.replace(/^mailto:/i, '').trim() : null,
      },
    });
  }

  // Emit committees in canonical order so the sidebar buttons are stable.
  const ordered = {};
  for (const year of Object.keys(byYear)) {
    const committees = byYear[year];
    ordered[year] = {};
    Object.keys(committees)
      .sort((a, b) => {
        const ia = COMMITTEE_ORDER.indexOf(a);
        const ib = COMMITTEE_ORDER.indexOf(b);
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      })
      .forEach((code) => {
        ordered[year][code] = committees[code];
      });
  }

  return ordered;
}

const ExecutivePage = async () => {
  const rows = await getExecutives();
  const executiveData = groupExecutives(rows);

  return <ExecutivesClient executiveData={executiveData} />;
};

export default ExecutivePage;
