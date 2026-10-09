import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/supabase/auth';
import AnnouncementForm from '../_AnnouncementForm';

export const dynamic = 'force-dynamic';

export default async function NewAnnouncementPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  return <AnnouncementForm mode="create" />;
}
