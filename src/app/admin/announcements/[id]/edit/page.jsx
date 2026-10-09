import { notFound, redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import AnnouncementForm from '../../_AnnouncementForm';

export const dynamic = 'force-dynamic';

export default async function EditAnnouncementPage({ params }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');

  const { id } = await params;
  const { data: row } = await createAdminClient()
    .from('announcements')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!row) notFound();

  return <AnnouncementForm mode="edit" id={row.id} initial={row} />;
}
