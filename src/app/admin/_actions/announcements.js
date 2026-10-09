'use server';

import { revalidateTag } from 'next/cache';
import { requireAdmin, requireSuperadmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';

// Matches TAGS.announcements in src/lib/queries.ts (the news ticker's cache tag).
const ANNOUNCEMENTS_TAG = 'announcements';

function clean(data = {}) {
  const num = Number(data.priority);
  return {
    title: (data.title ?? '').toString().trim(),
    body: data.body ? data.body.toString() : null,
    link_url: data.link_url ? data.link_url.toString().trim() : null,
    link_label: data.link_label ? data.link_label.toString().trim() : null,
    variant: ['info', 'event', 'alert', 'warning', 'success'].includes(data.variant)
      ? data.variant
      : 'info',
    priority: Number.isFinite(num) ? num : 0,
    is_active: data.is_active === true || data.is_active === 'on',
    starts_at: data.starts_at ? data.starts_at : null,
    ends_at: data.ends_at ? data.ends_at : null,
  };
}

export async function createAnnouncement(data) {
  try {
    const admin = await requireAdmin();
    const row = clean(data);
    if (!row.title) return { error: 'News text (title) is required.' };
    const { error } = await createAdminClient()
      .from('announcements')
      .insert({ ...row, created_by: admin.userId });
    if (error) return { error: error.message };
    revalidateTag(ANNOUNCEMENTS_TAG);
    return { ok: true };
  } catch {
    return { error: 'Could not create the announcement.' };
  }
}

export async function updateAnnouncement(id, data) {
  try {
    await requireAdmin();
    const row = clean(data);
    if (!row.title) return { error: 'News text (title) is required.' };
    const { error } = await createAdminClient().from('announcements').update(row).eq('id', id);
    if (error) return { error: error.message };
    revalidateTag(ANNOUNCEMENTS_TAG);
    return { ok: true };
  } catch {
    return { error: 'Could not update the announcement.' };
  }
}

export async function deleteAnnouncement(id) {
  try {
    await requireSuperadmin();
    const { error } = await createAdminClient().from('announcements').delete().eq('id', id);
    if (error) return { error: error.message };
    revalidateTag(ANNOUNCEMENTS_TAG);
    return { ok: true };
  } catch {
    return { error: 'Could not delete the announcement.' };
  }
}
