'use client';

import Link from '@/app/admin/_components/Link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, CalendarDays, FileCheck2, Mail, Users, Megaphone,
  GraduationCap, Trophy, Images, Handshake, Star, HelpCircle, Quote, BadgeCheck, Phone, Code2,
} from 'lucide-react';
import { cx } from '@/app/utils/cx';

/** Map the serializable `icon` key (passed from the server layout) to an icon. */
const ICONS = {
  dashboard: LayoutDashboard,
  events: CalendarDays,
  announcements: Megaphone,
  executives: GraduationCap,
  achievements: Trophy,
  gallery: Images,
  collaborations: Handshake,
  spotlights: Star,
  moderators: Quote,
  faqs: HelpCircle,
  membership: BadgeCheck,
  contactinfo: Phone,
  contributors: Code2,
  submissions: FileCheck2,
  messages: Mail,
  users: Users,
};

function isActive(pathname, href) {
  // Dashboard is only active on an exact match, otherwise it would light up
  // for every /admin/* route.
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(href + '/');
}

/**
 * Navigation list with active-link highlighting via usePathname.
 * `variant="sidebar"` renders the vertical desktop list; `variant="mobile"`
 * renders a compact horizontal strip for the mobile top area.
 */
export default function SidebarNav({ items = [], variant = 'sidebar' }) {
  const pathname = usePathname() || '';
  const mobile = variant === 'mobile';

  return (
    <nav
      aria-label="Admin"
      className={cx(
        mobile ? 'flex gap-1 px-2 py-2' : 'flex flex-1 flex-col gap-1 px-3 py-4'
      )}
    >
      {items.map((item) => {
        const Icon = ICONS[item.icon] || LayoutDashboard;
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cx(
              'group flex items-center gap-3 rounded-lg text-sm font-medium transition-colors',
              mobile ? 'whitespace-nowrap px-3 py-2' : 'px-3 py-2',
              active
                ? mobile
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
            )}
          >
            <Icon
              className={cx(
                'h-5 w-5 shrink-0',
                active && !mobile
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : active && mobile
                    ? 'text-white'
                    : 'text-gray-400 group-hover:text-gray-600 dark:text-slate-500 dark:group-hover:text-slate-300'
              )}
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
