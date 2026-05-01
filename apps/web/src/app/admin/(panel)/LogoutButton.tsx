'use client';

import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      /* ignore */
    }
    router.push('/admin/login');
    router.refresh();
  }
  return (
    <button onClick={logout} className="btn-outline mt-4 w-full">
      Sign out
    </button>
  );
}
