'use client';

import { usePathname } from 'next/navigation';

/**
 * Renders its children on public routes only. On /admin/* it renders nothing,
 * so the public navbar, news ticker, chatbot and footer don't bleed into the
 * admin panel (which has its own shell). A fragment wrapper — adds no DOM.
 */
export default function HideOnAdmin({ children }) {
  const pathname = usePathname();
  if (pathname && pathname.startsWith('/admin')) return null;
  return <>{children}</>;
}
