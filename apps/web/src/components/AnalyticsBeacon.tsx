'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function getVisitorId(): string {
  const KEY = 'portfolio_vid';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    localStorage.setItem(KEY, id);
  }
  return id;
}

export default function AnalyticsBeacon() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith('/admin')) return;
    try {
      const visitorId = getVisitorId();
      void fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pathname,
          referrer: document.referrer || null,
          visitorId,
        }),
        keepalive: true,
      });
    } catch {
      // ignore
    }
  }, [pathname]);
  return null;
}
