import { requireAdmin } from '@/lib/supabase/auth';
import AchievementForm from '../_AchievementForm';

export const dynamic = 'force-dynamic';

export default async function NewAchievementPage() {
  await requireAdmin();
  return <AchievementForm mode="create" />;
}
