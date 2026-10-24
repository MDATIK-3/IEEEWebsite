'use server';

import { revalidateTag } from 'next/cache';
import { requireAdmin, requireSuperadmin } from '@/lib/supabase/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { TAGS } from '@/lib/queries';
import { cleanRichText } from '@/lib/sanitizeHtml';

/**
 * Server actions for the content moderation workflow.
 *
 * Data-entry admins SUBMIT creates/edits into `content_submissions` (pending).
 * Superadmins APPROVE / DENY / MODIFY (and DELETE live rows). Approving applies
 * the proposed_data to the live table, then revalidates the matching cache tag
 * so public pages refresh immediately.
 */

// Map a live target_table -> the revalidation tag used by src/lib/queries.ts.
// Most tags equal the table name; these are the ones that differ, plus the two
// the task calls out explicitly (events, announcements). Unknown tables fall
// back to the raw table name (best-effort) so revalidation is still attempted.
const TABLE_TO_TAG = {
  events: TAGS.events,
  announcements: TAGS.announcements,
  executives: TAGS.executives,
  achievements: TAGS.achievements,
  collaborations: TAGS.collaborations,
  faqs: TAGS.faqs,
  moderator_messages: TAGS.moderatorMessages,
  spotlights: TAGS.spotlights,
  gallery_photos: TAGS.gallery,
  membership_info: TAGS.membership,
  contact_info: TAGS.contactInfo,
  contributors: TAGS.contributors,
  organization_types: TAGS.formOptions,
  partnership_types: TAGS.formOptions,
};

function tagFor(table) {
  return TABLE_TO_TAG[table] || table;
}

// Fields that hold admin-authored rich text (HTML from the WYSIWYG editor).
// `fields` are top-level string columns; `arrays` are jsonb array columns whose
// objects carry a rich-text field. Everything here is sanitized on write so the
// live tables (and content_submissions) only ever store safe markup.
const RICH_TEXT = {
  events: { fields: ['description'], arrays: [{ path: 'speakers', fields: ['bio'] }] },
  achievements: { fields: ['details'], arrays: [] },
};

function sanitizeProposed(table, data) {
  const spec = RICH_TEXT[table];
  if (!spec || !data || typeof data !== 'object') return data;
  const out = { ...data };
  for (const f of spec.fields || []) {
    if (f in out) out[f] = cleanRichText(out[f]);
  }
  for (const arr of spec.arrays || []) {
    if (Array.isArray(out[arr.path])) {
      out[arr.path] = out[arr.path].map((item) => {
        if (!item || typeof item !== 'object') return item;
        const copy = { ...item };
        for (const f of arr.fields) if (f in copy) copy[f] = cleanRichText(copy[f]);
        return copy;
      });
    }
  }
  return out;
}

/**
 * Data-entry (or superadmin) submits a create/update into the moderation queue.
 * @param {{ targetTable: string, targetId?: number|string|null, action: 'create'|'update', proposedData: object }} input
 * @returns {Promise<{ ok: true } | { error: string }>}
 */
export async function submitChange({ targetTable, targetId, action, proposedData }) {
  try {
    const a = await requireAdmin();
    if (!targetTable) throw new Error('targetTable is required');
    if (action !== 'create' && action !== 'update') throw new Error('Invalid action');
    if (action === 'update' && (targetId === null || targetId === undefined)) {
      throw new Error('targetId is required for an update');
    }

    const supabase = createAdminClient();
    const data = sanitizeProposed(targetTable, proposedData ?? {});

    // Superadmins apply changes immediately (no self-approval step). This is
    // what makes scheduling work for them: the row lands in the live table and
    // publish_at + RLS control when it goes public.
    if (a.role === 'superadmin') {
      let appliedId = targetId ?? null;
      if (action === 'create') {
        const { data: inserted, error } = await supabase
          .from(targetTable)
          .insert(data)
          .select('id')
          .single();
        if (error) throw new Error(error.message);
        appliedId = inserted?.id ?? null;
      } else {
        const { error } = await supabase.from(targetTable).update(data).eq('id', targetId);
        if (error) throw new Error(error.message);
      }
      // Record it as an auto-approved submission for the audit trail.
      await supabase.from('content_submissions').insert({
        target_table: targetTable,
        target_id: appliedId,
        action,
        proposed_data: data,
        status: 'approved',
        submitted_by: a.userId,
        reviewed_by: a.userId,
        reviewed_at: new Date().toISOString(),
      });
      await supabase.from('audit_log').insert({
        actor_id: a.userId,
        action,
        entity: targetTable,
        entity_id: appliedId,
        detail: { direct: true },
      });
      revalidateTag(tagFor(targetTable));
      return { ok: true, applied: true };
    }

    // Data-entry: queue for superadmin approval.
    const { error } = await supabase.from('content_submissions').insert({
      target_table: targetTable,
      target_id: action === 'create' ? null : targetId,
      action,
      proposed_data: data,
      status: 'pending',
      submitted_by: a.userId,
    });
    if (error) throw new Error(error.message);

    return { ok: true, applied: false };
  } catch (e) {
    return { error: e?.message || 'Failed to submit change' };
  }
}

/**
 * Superadmin approves a pending submission, applying it to the live table.
 * @param {number|string} id content_submissions.id
 * @param {object} [override] edited proposed_data to apply instead of the stored one (the "Modify" path)
 * @returns {Promise<{ ok: true } | { error: string }>}
 */
export async function approveSubmission(id, override) {
  try {
    const reviewer = await requireSuperadmin();
    const supabase = createAdminClient();

    const { data: sub, error: loadErr } = await supabase
      .from('content_submissions')
      .select('*')
      .eq('id', id)
      .single();
    if (loadErr) throw new Error(loadErr.message);
    if (!sub) throw new Error('Submission not found');
    if (sub.status !== 'pending') throw new Error('This submission has already been reviewed');

    const data = sanitizeProposed(
      sub.target_table,
      override && typeof override === 'object' ? override : sub.proposed_data
    );

    // Apply to the live table (service role bypasses RLS).
    let appliedId = sub.target_id ?? null;
    if (sub.action === 'create') {
      const { data: inserted, error } = await supabase
        .from(sub.target_table)
        .insert(data)
        .select('id')
        .single();
      if (error) throw new Error(error.message);
      appliedId = inserted?.id ?? null;
    } else {
      const { error } = await supabase
        .from(sub.target_table)
        .update(data)
        .eq('id', sub.target_id);
      if (error) throw new Error(error.message);
    }

    // Mark the submission approved. Persist the applied (possibly overridden)
    // payload so the record reflects exactly what went live.
    const { error: updErr } = await supabase
      .from('content_submissions')
      .update({
        status: 'approved',
        proposed_data: data,
        reviewed_by: reviewer.userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id);
    if (updErr) throw new Error(updErr.message);

    // Notify the submitter and record the privileged action (best-effort).
    await supabase.from('notifications').insert({
      recipient_id: sub.submitted_by,
      type: 'decision',
      title: 'Approved',
      body: `Your ${sub.action} for "${sub.target_table}" was approved.`,
      link: `/admin/${sub.target_table}`,
    });
    await supabase.from('audit_log').insert({
      actor_id: reviewer.userId,
      action: 'approve',
      entity: sub.target_table,
      entity_id: appliedId,
      detail: { submission_id: sub.id, submission_action: sub.action, overridden: !!override },
    });

    revalidateTag(tagFor(sub.target_table));
    return { ok: true };
  } catch (e) {
    return { error: e?.message || 'Failed to approve submission' };
  }
}

/**
 * Superadmin denies (rejects) a pending submission.
 * @param {number|string} id content_submissions.id
 * @param {string} [note] reason shown to the submitter
 * @returns {Promise<{ ok: true } | { error: string }>}
 */
export async function denySubmission(id, note) {
  try {
    const reviewer = await requireSuperadmin();
    const supabase = createAdminClient();

    const { data: sub, error: loadErr } = await supabase
      .from('content_submissions')
      .select('*')
      .eq('id', id)
      .single();
    if (loadErr) throw new Error(loadErr.message);
    if (!sub) throw new Error('Submission not found');

    const { error: updErr } = await supabase
      .from('content_submissions')
      .update({
        status: 'rejected',
        review_note: note || null,
        reviewed_by: reviewer.userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id);
    if (updErr) throw new Error(updErr.message);

    await supabase.from('notifications').insert({
      recipient_id: sub.submitted_by,
      type: 'decision',
      title: 'Rejected',
      body: note ? `Rejected: ${note}` : `Your ${sub.action} for "${sub.target_table}" was rejected.`,
      link: '/admin/submissions',
    });
    await supabase.from('audit_log').insert({
      actor_id: reviewer.userId,
      action: 'reject',
      entity: sub.target_table,
      entity_id: sub.target_id ?? null,
      detail: { submission_id: sub.id, note: note || null },
    });

    return { ok: true };
  } catch (e) {
    return { error: e?.message || 'Failed to deny submission' };
  }
}

/**
 * Superadmin deletes a live content row directly (no queue).
 * @param {{ table: string, id: number|string }} input
 * @returns {Promise<{ ok: true } | { error: string }>}
 */
export async function deleteContent({ table, id }) {
  try {
    const admin = await requireSuperadmin();
    if (!table || id === null || id === undefined) throw new Error('table and id are required');

    const supabase = createAdminClient();
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw new Error(error.message);

    await supabase.from('audit_log').insert({
      actor_id: admin.userId,
      action: 'delete',
      entity: table,
      entity_id: id,
      detail: { table, id },
    });

    revalidateTag(tagFor(table));
    return { ok: true };
  } catch (e) {
    return { error: e?.message || 'Failed to delete content' };
  }
}
