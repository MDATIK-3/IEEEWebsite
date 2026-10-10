import { requireAdmin } from '@/lib/supabase/auth';
import CollaborationForm from '../_CollaborationForm';

export const dynamic = 'force-dynamic';

export default async function NewCollaborationPage() {
  await requireAdmin();
  return <CollaborationForm mode="create" />;
}
