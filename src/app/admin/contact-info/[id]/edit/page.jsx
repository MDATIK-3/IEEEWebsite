import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import ContactInfoForm from '../../_ContactInfoForm';

export const dynamic = 'force-dynamic';

export default async function EditContactInfoPage({ params }) {
  await requireAdmin();

  // Next 15: dynamic route params are async.
  const { id } = await params;

  const supabase = createAdminClient();
  const { data: card, error } = await supabase
    .from('contact_info')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load contact card: ${error.message}`);
  }
  if (!card) {
    notFound();
  }

  return <ContactInfoForm mode="edit" cardId={card.id} initial={card} />;
}
