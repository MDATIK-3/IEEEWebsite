'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function getSessionId() {
  try {
    let sid = sessionStorage.getItem('ieee_sid');
    if (!sid) {
      sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem('ieee_sid', sid);
    }
    return sid;
  } catch {
    return null;
  }
}

export default function PageViewTracker() {
  const pathname = usePathname();
  const lastSent = useRef(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;
    if (pathname === lastSent.current) return; // guard double-render / strict mode
    lastSent.current = pathname;

    const body = JSON.stringify({
      path: pathname,
      referrer: typeof document !== 'undefined' ? document.referrer || null : null,
      sid: getSessionId(),
    });

    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
        cache: 'no-store',
      }).catch(() => {});
    } catch {
      /* never let tracking break navigation */
    }
  }, [pathname]);

  return null;
}
