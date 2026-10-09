'use server';

import { requireSuperadmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

/** Superadmin creates a data-entry account directly (name + email + password). */
export async function createDataEntry({ fullName, email, password } = {}) {
  try {
    await requireSuperadmin();
    const mail = (email || '').toString().trim().toLowerCase();
    const name = (fullName || '').toString().trim();
    const pass = (password || '').toString();
    if (!EMAIL_RE.test(mail)) return { error: 'Enter a valid email address.' };
    if (pass.length < 8) return { error: 'Password must be at least 8 characters.' };

    const db = createAdminClient();
    const { data, error } = await db.auth.admin.createUser({
      email: mail,
      password: pass,
      email_confirm: true,
      user_metadata: { full_name: name },
    });
    if (error) return { error: error.message };

    const { error: pe } = await db
      .from('admin_profiles')
      .upsert({ id: data.user.id, full_name: name || null, role: 'data_entry', is_active: true });
    if (pe) return { error: pe.message };

    return { ok: true };
  } catch {
    return { error: 'Could not create the account.' };
  }
}

/** Superadmin sets a new password for any account. */
export async function changeUserPassword(userId, password) {
  try {
    await requireSuperadmin();
    const pass = (password || '').toString();
    if (pass.length < 8) return { error: 'Password must be at least 8 characters.' };
    const { error } = await createAdminClient().auth.admin.updateUserById(userId, { password: pass });
    if (error) return { error: error.message };
    return { ok: true };
  } catch {
    return { error: 'Could not change the password.' };
  }
}

/** Superadmin toggles an account active/inactive (blocks sign-in via RLS/guards). */
export async function setUserActive(userId, isActive) {
  try {
    const me = await requireSuperadmin();
    if (me.userId === userId) return { error: 'You cannot deactivate your own account.' };
    const { error } = await createAdminClient()
      .from('admin_profiles')
      .update({ is_active: !!isActive })
      .eq('id', userId);
    if (error) return { error: error.message };
    return { ok: true };
  } catch {
    return { error: 'Could not update the account.' };
  }
}

/** Superadmin deletes a data-entry account (not self, not other superadmins). */
export async function deleteUser(userId) {
  try {
    const me = await requireSuperadmin();
    if (me.userId === userId) return { error: 'You cannot delete your own account.' };
    const db = createAdminClient();
    const { data: prof } = await db.from('admin_profiles').select('role').eq('id', userId).maybeSingle();
    if (prof?.role === 'superadmin') return { error: 'Cannot delete a superadmin account.' };
    const { error } = await db.auth.admin.deleteUser(userId); // cascades to admin_profiles
    if (error) return { error: error.message };
    return { ok: true };
  } catch {
    return { error: 'Could not delete the account.' };
  }
}
