import { notFound, redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import ModeratorForm from '../../_ModeratorForm';

export const dynamic = 'force-dynamic';

export default async function EditModeratorPage({ params }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');

  const { id } = await params;
  const { data: row } = await createAdminClient()
    .from('moderator_messages')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!row) notFound();

  return <ModeratorForm mode="edit" moderatorId={row.id} initial={row} />;
}
