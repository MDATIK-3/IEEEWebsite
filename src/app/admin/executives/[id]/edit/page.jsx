import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import ExecutiveForm from '../../_ExecutiveForm';

export const dynamic = 'force-dynamic';

export default async function EditExecutivePage({ params }) {
  await requireAdmin();

  // Next 15: dynamic route params are async.
  const { id } = await params;

  const supabase = createAdminClient();
  const { data: executive, error } = await supabase
    .from('executives')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load executive: ${error.message}`);
  }
  if (!executive) {
    notFound();
  }

  return <ExecutiveForm mode="edit" executiveId={executive.id} initial={executive} />;
}
