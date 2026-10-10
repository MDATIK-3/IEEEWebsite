'use server';

import { requireAdmin, requireSuperadmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';

const TABLES = {
  contact: 'contact_submissions',
  partnership: 'partnership_submissions',
  feedback: 'feedback',
};
const STATUSES = ['new', 'read', 'resolved'];

export async function setMessageStatus(kind, id, status) {
  try {
    await requireAdmin();
    const table = TABLES[kind];
    if (!table) return { error: 'Unknown message type.' };
    if (!STATUSES.includes(status)) return { error: 'Invalid status.' };
    const { error } = await createAdminClient().from(table).update({ status }).eq('id', id);
    if (error) return { error: error.message };
    return { ok: true };
  } catch {
    return { error: 'Could not update the message.' };
  }
}

export async function deleteMessage(kind, id) {
  try {
    await requireSuperadmin();
    const table = TABLES[kind];
    if (!table) return { error: 'Unknown message type.' };
    const { error } = await createAdminClient().from(table).delete().eq('id', id);
    if (error) return { error: error.message };
    return { ok: true };
  } catch {
    return { error: 'Could not delete the message.' };
  }
}
