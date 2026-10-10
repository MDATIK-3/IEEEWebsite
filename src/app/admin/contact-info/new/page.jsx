import { requireAdmin } from '@/lib/supabase/auth';
import ContactInfoForm from '../_ContactInfoForm';

export const dynamic = 'force-dynamic';

export default async function NewContactInfoPage() {
  await requireAdmin();
  return <ContactInfoForm mode="create" />;
}
