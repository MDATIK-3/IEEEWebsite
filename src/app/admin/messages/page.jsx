import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import MessagesClient from './_MessagesClient';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');

  const db = createAdminClient();
  const [contact, partnership, feedback] = await Promise.all([
    db.from('contact_submissions').select('*').order('created_at', { ascending: false }),
    db.from('partnership_submissions').select('*').order('created_at', { ascending: false }),
    db.from('feedback').select('*').order('created_at', { ascending: false }),
  ]);

  return (
    <MessagesClient
      isSuper={admin.role === 'superadmin'}
      contact={contact.data || []}
      partnership={partnership.data || []}
      feedback={feedback.data || []}
    />
  );
}
