import { getGalleryPhotos } from '@/lib/queries';

// Gallery photos change rarely; mirror the cached getter's window. Admin writes
// call revalidateTag(TAGS.gallery) to refresh instantly.
export const revalidate = 86400;

// Public, read-only list of gallery photos for the client gallery/preview.
// Shape matches the legacy photos.json ({ id, image, name, date }) so the
// gallery UI keeps working after the data moved to the database.
export async function GET() {
  const rows = await getGalleryPhotos();
  const photos = rows.map((p: { id: number; image: string; name: string | null; taken_on: string | null }) => ({
    id: p.id,
    image: p.image,
    name: p.name ?? '',
    date: p.taken_on ?? '',
  }));

  return Response.json(photos, {
    headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400' },
  });
}
