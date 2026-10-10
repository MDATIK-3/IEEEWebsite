import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/supabase/auth';
import ModeratorForm from '../_ModeratorForm';

export const dynamic = 'force-dynamic';

export default async function NewModeratorPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  return <ModeratorForm mode="create" />;
}
