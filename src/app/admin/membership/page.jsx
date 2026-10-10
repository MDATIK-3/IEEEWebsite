import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import MembershipForm from './_MembershipForm';

export const dynamic = 'force-dynamic';

/**
 * Membership is a SINGLETON: a single row with id = 1 in `membership_info`.
 * There is no list/new — just this editor. We guard the route ourselves and
 * load the (guaranteed-to-exist) row with the service-role client, then hand
 * it to the client form for editing.
 */
export default async function MembershipAdminPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');

  const supabase = createAdminClient();
  const { data: membership, error } = await supabase
    .from('membership_info')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load membership info: ${error.message}`);
  }

  return <MembershipForm initial={membership || {}} />;
}
