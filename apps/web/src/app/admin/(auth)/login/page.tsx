'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <div className="hero-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-[520px] bg-radial-fade" aria-hidden />
      <div className="relative w-full max-w-sm">
        <Link
          href="/"
          className="btn-link mb-6 inline-flex text-[hsl(var(--muted-foreground))]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to site
        </Link>
        <div className="surface p-7">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-glow">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h1 className="display-heading text-xl">Admin sign in</h1>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Manage your portfolio, shop, and blog.
              </p>
            </div>
          </div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="label" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
