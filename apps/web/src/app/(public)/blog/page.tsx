import Link from 'next/link';
import { serverFetch } from '@/lib/api';
import type { BlogPost } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import PageHeader from '@/components/PageHeader';
import { ArrowRight, BookOpen } from 'lucide-react';

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
    <>
      <PageHeader
        eyebrow="Blog"
        title="Notes from the studio"
        description="Practical write-ups on Next.js, Prisma, design systems, and shipping habits."
      />

      <section className="container-page py-16">
        {posts.length === 0 ? (
          <div className="card mx-auto max-w-md text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
              <BookOpen className="h-5 w-5" />
            </span>
            <h2 className="display-heading mt-4 text-lg">No posts yet</h2>
            <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
              Posts will show up here once they&apos;re published from the admin panel.
            </p>
          </div>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <li key={p.id}>
                <Link href={`/blog/${p.slug}`} className="card-hover group flex h-full flex-col p-0 overflow-hidden">
                  {p.coverImageUrl ? (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[hsl(var(--muted))]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.coverImageUrl}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">
                      {formatDate(p.publishedAt ?? p.createdAt)}
                      {p.category && <span> · {p.category.name}</span>}
                    </p>
                    <h2 className="display-heading mt-3 text-lg">{p.title}</h2>
                    {p.excerpt && (
                      <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] line-clamp-3">
                        {p.excerpt}
                      </p>
                    )}
                    <span className="btn-link mt-5 inline-flex text-brand-600 dark:text-brand-300">
                      Read post <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
