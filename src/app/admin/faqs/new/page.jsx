import { requireAdmin } from '@/lib/supabase/auth';
import FaqForm from '../_FaqForm';

export const dynamic = 'force-dynamic';

export default async function NewFaqPage() {
  await requireAdmin();
  return <FaqForm mode="create" />;
}
