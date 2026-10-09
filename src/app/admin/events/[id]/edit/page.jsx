import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import EventForm from '../../_EventForm';

export const dynamic = 'force-dynamic';

export default async function EditEventPage({ params }) {
  await requireAdmin();

  // Next 15: dynamic route params are async.
  const { id } = await params;

  const supabase = createAdminClient();
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load event: ${error.message}`);
  }
  if (!event) {
    notFound();
  }

  return <EventForm mode="edit" eventId={event.id} initial={event} />;
}
