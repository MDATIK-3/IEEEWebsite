import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import FaqForm from '../../_FaqForm';

export const dynamic = 'force-dynamic';

export default async function EditFaqPage({ params }) {
  await requireAdmin();

  // Next 15: dynamic route params are async.
  const { id } = await params;

  const supabase = createAdminClient();
  const { data: faq, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load FAQ: ${error.message}`);
  }
  if (!faq) {
    notFound();
  }

  return <FaqForm mode="edit" faqId={faq.id} initial={faq} />;
}
