import { requireAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import ExecutiveForm from '../_ExecutiveForm';
import { mergePeople } from '../_people';

export const dynamic = 'force-dynamic';

export default async function NewExecutivePage() {
  const admin = await requireAdmin();
  const supabase = createAdminClient();

  // Pull person details from every table that stores them, so the reuse picker
  // can fill a known person's name/photo/email/socials without re-typing.
  const [execs, contributors, spotlights, moderators] = await Promise.all([
    supabase
      .from('executives')
      .select('name, img, facebook, linkedin, email, role, committee, year, updated_at')
      .order('year', { ascending: false })
      .order('updated_at', { ascending: false }),
    supabase.from('contributors').select('name, avatar_url, facebook, linkedin, email, developer_type'),
    supabase.from('spotlights').select('name, role, photo, socials'),
    supabase.from('moderator_messages').select('name, title, image'),
  ]);

  // Admin login accounts expose private emails, so only superadmins get them
  // (mirrors the superadmin-only /admin/users page).
  let admins = [];
  if (admin.role === 'superadmin') {
    const { data: profiles } = await supabase.from('admin_profiles').select('id, full_name, role');
    let emailById = new Map();
    try {
      const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      emailById = new Map((list?.users || []).map((u) => [u.id, u.email]));
    } catch {
      // Auth admin listing unavailable — fall back to accounts without emails.
    }
    admins = (profiles || []).map((p) => ({
      full_name: p.full_name,
      role: p.role,
      email: emailById.get(p.id) || '',
    }));
  }

  const members = mergePeople({
    executives: execs.data || [],
    contributors: contributors.data || [],
    spotlights: spotlights.data || [],
    moderators: moderators.data || [],
    admins,
  });

  return <ExecutiveForm mode="create" members={members} />;
}
