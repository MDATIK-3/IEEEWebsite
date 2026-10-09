'use server';

import { randomBytes } from 'crypto';
import { requireAdmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';

const SAFE_FOLDER = /^[a-z0-9_-]+$/i;
const MAX_BYTES = 10 * 1024 * 1024;
const BUCKET = 'media';

/**
 * Uploads an image (from a FormData `file`) to the public `media` Storage
 * bucket and returns its public URL. Admin-only; uses the service-role client
 * so no per-bucket storage policy is required. `folder` groups uploads
 * (e.g. 'events', 'executives').
 */
export async function uploadImage(formData) {
  try {
    await requireAdmin();

    const file = formData.get('file');
    if (!file || typeof file === 'string' || typeof file.arrayBuffer !== 'function') {
      return { error: 'No file provided.' };
    }
    if (!file.type || !file.type.startsWith('image/')) {
      return { error: 'Only image files are allowed.' };
    }
    if (file.size > MAX_BYTES) {
      return { error: 'Image must be 10MB or smaller.' };
    }

    let folder = (formData.get('folder') || 'misc').toString();
    if (!SAFE_FOLDER.test(folder)) folder = 'misc';

    const ext = ((file.name || '').split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
    const path = `${folder}/${Date.now()}-${randomBytes(6).toString('hex')}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const admin = createAdminClient();
    const { error } = await admin.storage.from(BUCKET).upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });
    if (error) return { error: error.message };

    const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
    return { url: data.publicUrl, path };
  } catch (e) {
    const msg = e instanceof Error ? e.message : '';
    if (msg === 'Unauthorized' || msg.startsWith('Forbidden')) return { error: 'Not authorized.' };
    return { error: 'Upload failed. Please try again.' };
  }
}
