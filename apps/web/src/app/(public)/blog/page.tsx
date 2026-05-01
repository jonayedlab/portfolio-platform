import Link from 'next/link';
import { serverFetch } from '@/lib/api';
import type { BlogPost } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Blog' };

export default async function BlogIndex() {
  let posts: BlogPost[] = [];
  try {
    posts = (await serverFetch<{ posts: BlogPost[] }>('/api/blog')).posts;
  } catch {
    posts = [];
  }
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-[hsl(var(--muted-foreground))]">No posts yet.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.id} className="card">
              <Link href={`/blog/${p.slug}`} className="text-xl font-semibold hover:text-brand">
                {p.title}
              </Link>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                {formatDate(p.publishedAt ?? p.createdAt)}
                {p.category && <span> · {p.category.name}</span>}
              </p>
              {p.excerpt && <p className="mt-2 text-sm">{p.excerpt}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
