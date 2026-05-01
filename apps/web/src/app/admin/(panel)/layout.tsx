import { redirect } from 'next/navigation';
import Link from 'next/link';
import { serverFetch } from '@/lib/api';
import LogoutButton from './LogoutButton';

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/profile', label: 'Profile' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/requests', label: 'Requests' },
  { href: '/admin/messages', label: 'Messages' },
];

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  let user: { name: string; email: string; role: string } | null = null;
  try {
    const res = await serverFetch<{ user: { name: string; email: string; role: string } }>(
      '/api/auth/me',
    );
    user = res.user;
  } catch {
    user = null;
  }
  if (!user || user.role !== 'ADMIN') {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 border-r border-[hsl(var(--border))] p-4 hidden md:flex flex-col">
        <div className="mb-6">
          <Link href="/" className="text-lg font-semibold">
            Jonayed CMS
          </Link>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{user.email}</p>
        </div>
        <nav className="flex-1 space-y-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="block rounded-md px-3 py-2 text-sm hover:bg-[hsl(var(--muted))]"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <LogoutButton />
      </aside>
      <main className="flex-1 p-6 sm:p-8">{children}</main>
    </div>
  );
}
