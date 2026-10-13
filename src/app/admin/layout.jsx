import Link from '@/app/admin/_components/Link';
import { ShieldCheck } from 'lucide-react';
import { getCurrentAdmin } from '@/lib/supabase/auth';
import { cx } from '@/app/utils/cx';
import SidebarNav from './_components/SidebarNav';
import LogoutButton from './_components/LogoutButton';

// This layout reads the session cookie, so it must never be statically rendered.
export const dynamic = 'force-dynamic';

const ROLE_META = {
  superadmin: {
    label: 'Superadmin',
    className:
      'bg-emerald-100 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/20',
  },
  data_entry: {
    label: 'Data Entry',
    className:
      'bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-700/40 dark:text-slate-300 dark:ring-slate-400/20',
  },
};

function RoleBadge({ role }) {
  const meta = ROLE_META[role] || ROLE_META.data_entry;
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
        meta.className
      )}
    >
      {meta.label}
    </span>
  );
}

export default async function AdminLayout({ children }) {
  const admin = await getCurrentAdmin();

  // Not signed in (e.g. the login page): render it bare, with no admin chrome.
  if (!admin) return <>{children}</>;

  const isSuper = admin.role === 'superadmin';
  const displayName = admin.fullName || admin.email || 'Admin';

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
    { href: '/admin/events', label: 'Events', icon: 'events' },
    { href: '/admin/announcements', label: 'News', icon: 'announcements' },
    { href: '/admin/executives', label: 'Executives', icon: 'executives' },
    { href: '/admin/achievements', label: 'Achievements', icon: 'achievements' },
    { href: '/admin/gallery', label: 'Gallery', icon: 'gallery' },
    { href: '/admin/collaborations', label: 'Collaborations', icon: 'collaborations' },
    { href: '/admin/spotlights', label: 'Spotlights', icon: 'spotlights' },
    { href: '/admin/moderators', label: 'Moderators', icon: 'moderators' },
    { href: '/admin/faqs', label: 'FAQs', icon: 'faqs' },
    { href: '/admin/membership', label: 'Membership', icon: 'membership' },
    { href: '/admin/contact-info', label: 'Contact Info', icon: 'contactinfo' },
    { href: '/admin/contributors', label: 'Contributors', icon: 'contributors' },
    { href: '/admin/messages', label: 'Messages', icon: 'messages' },
    ...(isSuper ? [{ href: '/admin/submissions', label: 'Submissions', icon: 'submissions' }] : []),
    ...(isSuper ? [{ href: '/admin/users', label: 'Users', icon: 'users' }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:flex">
        <Link
          href="/admin"
          className="flex items-center gap-3 border-b border-gray-200 px-5 py-4 dark:border-slate-800"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold">IEEE GUB</span>
            <span className="text-xs text-gray-500 dark:text-slate-400">Admin Panel</span>
          </span>
        </Link>

        <SidebarNav items={navItems} />

        <div className="mt-auto border-t border-gray-200 p-3 dark:border-slate-800">
          <div className="mb-2 flex items-center gap-3 px-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600/10 text-sm font-semibold uppercase text-emerald-700 dark:text-emerald-300">
              {displayName.charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{displayName}</p>
              <p className="truncate text-xs text-gray-500 dark:text-slate-400">{admin.email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-h-screen flex-col md:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white/80 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2 md:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-bold">IEEE Admin</span>
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm font-medium sm:inline">{displayName}</span>
            <RoleBadge role={admin.role} />
            <div className="md:hidden">
              <LogoutButton compact />
            </div>
          </div>
        </header>

        {/* Mobile navigation (the sidebar is hidden below md) */}
        <div className="border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:hidden">
          <div className="overflow-x-auto">
            <SidebarNav items={navItems} variant="mobile" />
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
