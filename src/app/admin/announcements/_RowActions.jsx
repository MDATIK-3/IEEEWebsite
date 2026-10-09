'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteAnnouncement } from '../_actions/announcements';

export default function AnnouncementRowActions({ id }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!window.confirm('Delete this news item?')) return;
    setBusy(true);
    const res = await deleteAnnouncement(id);
    setBusy(false);
    if (res?.error) {
      window.alert(res.error);
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={busy}
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/40"
    >
      <Trash2 className="h-4 w-4" /> {busy ? '…' : 'Delete'}
    </button>
  );
}
