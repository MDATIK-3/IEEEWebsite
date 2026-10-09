'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cx } from '@/app/utils/cx';

/**
 * Signs the admin out of Supabase, then returns them to the login screen.
 * `compact` renders an icon-only button (used in the mobile top bar).
 */
export default function LogoutButton({ className, compact = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;
    setLoading(true);
    try {
      await createClient().auth.signOut();
    } catch {
      // Ignore network/session errors — still send the user to the login page.
    }
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      aria-label="Sign out"
      title="Sign out"
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        compact
          ? 'h-9 w-9 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
          : 'w-full border border-gray-200 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
        className
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <LogOut className="h-4 w-4" aria-hidden="true" />
      )}
      {!compact && <span>{loading ? 'Signing out…' : 'Sign out'}</span>}
    </button>
  );
}
