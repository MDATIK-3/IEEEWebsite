import { requireAdmin } from '@/lib/supabase/auth';
import GalleryForm from '../_GalleryForm';

export const dynamic = 'force-dynamic';

export default async function NewGalleryPhotoPage() {
  await requireAdmin();
  return <GalleryForm mode="create" />;
}
