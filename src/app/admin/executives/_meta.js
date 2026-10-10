/**
 * Shared option sets + label helpers for the executives admin.
 *
 * These mirror the `executives` table's constrained columns:
 *   committee     -> SB | CS | PES | MAIN   (see 0001_init.sql)
 *   member_group  -> faculty | student
 *
 * Labels match the public Executives page (src/app/Executives/components/Sidebar.jsx)
 * so the admin and the site speak the same language.
 */
export const COMMITTEES = [
  { value: 'SB', label: 'Student Branch' },
  { value: 'CS', label: 'Computer Society' },
  { value: 'PES', label: 'Power & Energy Society' },
  { value: 'MAIN', label: 'Main Committee' },
];

export const GROUPS = [
  { value: 'faculty', label: 'Faculty' },
  { value: 'student', label: 'Student' },
];

export function committeeLabel(value) {
  return COMMITTEES.find((c) => c.value === value)?.label || value || '—';
}

export function groupLabel(value) {
  return GROUPS.find((g) => g.value === value)?.label || value || '—';
}
