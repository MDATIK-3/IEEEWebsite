import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import AchievementForm from '../../_AchievementForm';

export const dynamic = 'force-dynamic';

export default async function EditAchievementPage({ params }) {
  await requireAdmin();

  // Next 15: dynamic route params are async.
  const { id } = await params;

  const supabase = createAdminClient();
  const { data: achievement, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load achievement: ${error.message}`);
  }
  if (!achievement) {
    notFound();
  }

  return <AchievementForm mode="edit" achievementId={achievement.id} initial={achievement} />;
}
