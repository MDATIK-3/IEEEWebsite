import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import CollaborationForm from '../../_CollaborationForm';

export const dynamic = 'force-dynamic';

export default async function EditCollaborationPage({ params }) {
  await requireAdmin();

  // Next 15: dynamic route params are async.
  const { id } = await params;

  const supabase = createAdminClient();
  const { data: collaboration, error } = await supabase
    .from('collaborations')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load collaboration: ${error.message}`);
  }
  if (!collaboration) {
    notFound();
  }

  return (
    <CollaborationForm mode="edit" collaborationId={collaboration.id} initial={collaboration} />
  );
}
