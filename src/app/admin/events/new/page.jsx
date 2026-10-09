import { requireAdmin } from '@/lib/supabase/auth';
import EventForm from '../_EventForm';

export const dynamic = 'force-dynamic';

export default async function NewEventPage() {
  await requireAdmin();
  return <EventForm mode="create" />;
}
