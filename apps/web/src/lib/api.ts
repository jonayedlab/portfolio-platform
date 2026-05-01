// Server-side and client-side API helpers.
// On the server we hit the API directly via the env URL.
// On the client we go through Next's rewrites at /api/* (which proxies to the API).

const SERVER_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface FetchOpts extends RequestInit {
  // Forward cookies on server-rendered requests
  cookie?: string;
}

export async function apiFetch<T>(pathOrUrl: string, opts: FetchOpts = {}): Promise<T> {
  const isClient = typeof window !== 'undefined';
  const url = pathOrUrl.startsWith('http')
    ? pathOrUrl
    : isClient
      ? pathOrUrl // Next rewrites /api/* to the backend
      : `${SERVER_API_URL}${pathOrUrl}`;

  const headers = new Headers(opts.headers ?? {});
  headers.set('Content-Type', 'application/json');
  if (!isClient && opts.cookie) {
    headers.set('cookie', opts.cookie);
  }

  const res = await fetch(url, {
    ...opts,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg =
      (data && typeof data === 'object' && 'error' in data ? (data as { error?: string }).error : null) ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

// Server-only helpers that read cookies from `next/headers`
export async function serverFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  // Lazy import so this module stays usable on the client too.
  const { cookies } = await import('next/headers');
  const cookieHeader = cookies()
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
  return apiFetch<T>(path, { ...init, cookie: cookieHeader });
}
