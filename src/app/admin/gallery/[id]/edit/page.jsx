import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import GalleryForm from '../../_GalleryForm';

export const dynamic = 'force-dynamic';

export default async function EditGalleryPhotoPage({ params }) {
  await requireAdmin();

  // Next 15: dynamic route params are async.
  const { id } = await params;

  const supabase = createAdminClient();
  const { data: photo, error } = await supabase
    .from('gallery_photos')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load photo: ${error.message}`);
  }
  if (!photo) {
    notFound();
  }

  return <GalleryForm mode="edit" photoId={photo.id} initial={photo} />;
}
