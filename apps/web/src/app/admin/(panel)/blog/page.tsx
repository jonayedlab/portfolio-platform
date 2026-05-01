'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { BlogPost } from '@/lib/types';

export default function AdminBlogPage() {
  const [items, setItems] = useState<BlogPost[]>([]);

  async function load() {
    const res = await apiFetch<{ posts: BlogPost[] }>('/api/blog?all=true');
    setItems(res.posts);
  }
  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  async function remove(id: string) {
    if (!confirm('Delete this post?')) return;
    await apiFetch(`/api/blog/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog posts</h1>
        <Link href="/admin/blog/new" className="btn-primary">
          + New post
        </Link>
      </div>

      <ul className="space-y-2">
        {items.map((p) => (
          <li key={p.id} className="card flex items-center justify-between">
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                /{p.slug} ·{' '}
                <span
                  className={
                    p.status === 'PUBLISHED' ? 'text-green-600' : 'text-amber-600'
                  }
                >
                  {p.status.toLowerCase()}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/blog/${p.id}`} className="btn-outline">
                Edit
              </Link>
              <button className="btn-ghost text-red-600" onClick={() => remove(p.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
