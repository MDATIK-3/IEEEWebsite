'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, KeyRound, Trash2, Check } from 'lucide-react';
import { cx } from '@/app/utils/cx';
import Pagination from '@/app/admin/_components/Pagination';
import { createDataEntry, changeUserPassword, deleteUser, setUserActive } from '../_actions/users';

const field =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100';

function CreateForm({ onDone }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    const res = await createDataEntry({
      fullName: fd.get('fullName'),
      email: fd.get('email'),
      password: fd.get('password'),
    });
    setBusy(false);
    if (res?.error) { setMsg({ type: 'error', text: res.error }); return; }
    setMsg({ type: 'ok', text: 'Data-entry account created.' });
    e.currentTarget.reset();
    onDone?.();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
        <UserPlus className="h-5 w-5 text-emerald-600" /> Create data-entry account
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input name="fullName" type="text" placeholder="Full name" className={field} />
        <input name="email" type="email" placeholder="Email" required className={field} />
        <input name="password" type="text" placeholder="Password (min 8 chars)" required minLength={8} className={field} />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button type="submit" disabled={busy} className={cx('rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500', 'disabled:opacity-50')}>
          {busy ? 'Creating…' : 'Create account'}
        </button>
        {msg ? (
          <span className={cx('text-sm', msg.type === 'ok' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
            {msg.text}
          </span>
        ) : null}
      </div>
    </form>
  );
}

function PasswordInline({ userId }) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function save() {
    setBusy(true);
    const res = await changeUserPassword(userId, val);
    setBusy(false);
    if (res?.error) { window.alert(res.error); return; }
    setDone(true);
    setVal('');
    setOpen(false);
    setTimeout(() => setDone(false), 2000);
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
        <KeyRound className="h-4 w-4" /> {done ? <span className="text-emerald-600">Saved</span> : 'Password'}
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-1">
      <input type="text" value={val} onChange={(e) => setVal(e.target.value)} placeholder="New password" className="w-36 rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-900" />
      <button type="button" disabled={busy || val.length < 8} onClick={save} className="rounded bg-emerald-600 p-1 text-white disabled:opacity-50" aria-label="Save password">
        <Check className="h-4 w-4" />
      </button>
      <button type="button" onClick={() => { setOpen(false); setVal(''); }} className="text-xs text-slate-400">Cancel</button>
    </span>
  );
}

export default function UsersManager({ users = [], meId, meIsOwner = false, page = 1, total = 0, query = {} }) {
  const router = useRouter();

  async function onDelete(u) {
    if (!window.confirm(`Delete ${u.email}? This cannot be undone.`)) return;
    const res = await deleteUser(u.id);
    if (res?.error) { window.alert(res.error); return; }
    router.refresh();
  }
  async function onToggleActive(u) {
    const res = await setUserActive(u.id, !u.is_active);
    if (res?.error) { window.alert(res.error); return; }
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Create and manage data-entry accounts. Superadmins are managed in Supabase.
        </p>
      </div>

      <CreateForm onDone={() => router.refresh()} />

      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((u) => {
              const isSelf = u.id === meId;
              const isSuper = u.role === 'superadmin';
              // Only the owner may change another superadmin's password;
              // everyone keeps it for data-entry accounts and their own.
              const canChangePassword = !isSuper || isSelf || meIsOwner;
              return (
                <tr key={u.id} className="text-slate-800 dark:text-slate-200">
                  <td className="px-4 py-3">{u.full_name || '—'}</td>
                  <td className="px-4 py-3">{u.email}{isSelf ? <span className="ml-1 text-xs text-slate-400">(you)</span> : null}</td>
                  <td className="px-4 py-3">
                    <span className={isSuper ? 'rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300'}>
                      {isSuper ? 'Superadmin' : 'Data Entry'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => onToggleActive(u)} disabled={isSelf} className={cx('rounded-full px-2 py-0.5 text-xs font-medium disabled:opacity-60', u.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300')}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {canChangePassword ? <PasswordInline userId={u.id} /> : null}
                      {!isSelf && !isSuper ? (
                        <button type="button" onClick={() => onDelete(u)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40">
                          <Trash2 className="h-4 w-4" /> Delete
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination basePath="/admin/users" query={query} page={page} total={total} />
    </div>
  );
}
