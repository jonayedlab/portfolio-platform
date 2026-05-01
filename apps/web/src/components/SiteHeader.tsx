'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Moon, Sun, Menu, X, Sparkles } from 'lucide-react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/shop', label: 'Shop' },
  { href: '/blog', label: 'Blog' },
  { href: '/requests', label: 'Requests' },
  { href: '/contact', label: 'Contact' },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as 'light' | 'dark' | null) ?? 'light';
    setTheme(saved);
    document.documentElement.classList.toggle('dark', saved === 'dark');
    setMounted(true);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[hsl(var(--border))]/80 bg-[hsl(var(--background))]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[hsl(var(--background))]/60">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-glow transition-transform group-hover:scale-105">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">Jonayed</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
              Portfolio · Studio
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {links.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                  active
                    ? 'text-[hsl(var(--foreground))]'
                    : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
                )}
              >
                {l.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-brand-500 to-indigo-500" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="grid h-9 w-9 place-items-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
            aria-label="Toggle theme"
          >
            {mounted && theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link href="/contact" className="btn-primary hidden sm:inline-flex">
            Hire me
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          'md:hidden overflow-hidden border-t border-[hsl(var(--border))]/80 bg-[hsl(var(--background))]/95 backdrop-blur-xl transition-[max-height,opacity] duration-300',
          open ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <nav className="container-page flex flex-col gap-1 py-3" aria-label="Mobile">
          {links.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'rounded-xl px-3 py-2 text-sm transition-colors',
                  active
                    ? 'bg-[hsl(var(--muted))] font-medium text-[hsl(var(--foreground))]'
                    : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]',
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <Link href="/contact" className="btn-primary mt-2 self-start">
            Hire me
          </Link>
        </nav>
      </div>
    </header>
  );
}
