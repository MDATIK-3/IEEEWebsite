import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/supabase/auth';
import SpotlightForm from '../_SpotlightForm';

export const dynamic = 'force-dynamic';

export default async function NewSpotlightPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  return <SpotlightForm mode="create" />;
}
