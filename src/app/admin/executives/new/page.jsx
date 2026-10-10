import { requireAdmin } from '@/lib/supabase/auth';
import ExecutiveForm from '../_ExecutiveForm';

export const dynamic = 'force-dynamic';

export default async function NewExecutivePage() {
  await requireAdmin();
  return <ExecutiveForm mode="create" />;
}
