import { notFound, redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import SpotlightForm from '../../_SpotlightForm';

export const dynamic = 'force-dynamic';

export default async function EditSpotlightPage({ params }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');

  const { id } = await params;
  const { data: row } = await createAdminClient()
    .from('spotlights')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!row) notFound();

  return <SpotlightForm mode="edit" spotlightId={row.id} initial={row} />;
}
