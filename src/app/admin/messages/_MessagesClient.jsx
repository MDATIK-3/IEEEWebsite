'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { cx } from '@/app/utils/cx';
import { setMessageStatus, deleteMessage } from '../_actions/messages';

const STATUS_OPTIONS = ['new', 'read', 'resolved'];

function StatusPill({ status }) {
  const map = {
    new: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    read: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  };
  return <span className={cx('rounded-full px-2 py-0.5 text-xs font-medium', map[status] || map.new)}>{status || 'new'}</span>;
}

function Row({ kind, id, header, sub, body, status, isSuper, onStatus, onDelete }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-slate-900 dark:text-white">{header}</p>
          {sub ? <p className="text-sm text-slate-500 dark:text-slate-400">{sub}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          <StatusPill status={status} />
          <select
            value={status || 'new'}
            onChange={(e) => onStatus(kind, id, e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-900"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {isSuper ? (
            <button type="button" onClick={() => onDelete(kind, id)} className="rounded-md p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40" aria-label="Delete">
              <Trash2 className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
      {body ? <div className="mt-2 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">{body}</div> : null}
    </div>
  );
}

export default function MessagesClient({ isSuper, contact, partnership, feedback }) {
  const router = useRouter();
  const [tab, setTab] = useState('contact');

  async function onStatus(kind, id, status) {
    const r = await setMessageStatus(kind, id, status);
    if (r?.error) { window.alert(r.error); return; }
    router.refresh();
  }
  async function onDelete(kind, id) {
    if (!window.confirm('Delete this message?')) return;
    const r = await deleteMessage(kind, id);
    if (r?.error) { window.alert(r.error); return; }
    router.refresh();
  }

  const tabs = [
    ['contact', 'Contact', contact.length],
    ['partnership', 'Partnership', partnership.length],
    ['feedback', 'Feedback', feedback.length],
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">Messages</h1>
      <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
        Contact, partnership and feedback submissions from the public site.
      </p>

      <div className="mb-5 flex gap-1 border-b border-slate-200 dark:border-slate-800">
        {tabs.map(([key, label, count]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cx(
              '-mb-px border-b-2 px-4 py-2 text-sm font-medium transition',
              tab === key
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-300'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            )}
          >
            {label} <span className="ml-1 rounded-full bg-slate-100 px-1.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{count}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {tab === 'contact' &&
          (contact.length === 0 ? (
            <Empty />
          ) : (
            contact.map((m) => (
              <Row key={m.id} kind="contact" id={m.id} status={m.status} isSuper={isSuper} onStatus={onStatus} onDelete={onDelete}
                header={m.subject || '(no subject)'} sub={`${m.name || 'Anonymous'} · ${m.email || ''} · ${new Date(m.created_at).toLocaleString()}`} body={m.message} />
            ))
          ))}

        {tab === 'partnership' &&
          (partnership.length === 0 ? (
            <Empty />
          ) : (
            partnership.map((m) => {
              const d = m.data || {};
              return (
                <Row key={m.id} kind="partnership" id={m.id} status={m.status} isSuper={isSuper} onStatus={onStatus} onDelete={onDelete}
                  header={d.organizationName || '(organization)'} sub={`${d.contactPerson || ''} · ${d.email || ''} · ${d.partnershipType || ''}`}
                  body={d.projectDescription || JSON.stringify(d, null, 2)} />
              );
            })
          ))}

        {tab === 'feedback' &&
          (feedback.length === 0 ? (
            <Empty />
          ) : (
            feedback.map((m) => (
              <Row key={m.id} kind="feedback" id={m.id} status={m.status} isSuper={isSuper} onStatus={onStatus} onDelete={onDelete}
                header={`${m.name || 'Anonymous'}${m.rating ? ` · ${m.rating}★` : ''}`} sub={`${m.email || ''} · ${m.page || ''} · ${new Date(m.created_at).toLocaleString()}`} body={m.message} />
            ))
          ))}
      </div>
    </div>
  );
}

function Empty() {
  return (
    <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
      No messages yet.
    </p>
  );
}
