import Link from 'next/link';
import { serverFetch } from '@/lib/api';
import type { Profile, Project, BlogPost } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let profile: Profile | null = null;
  let projects: Project[] = [];
  let posts: BlogPost[] = [];
  try {
    const [p, pr, b] = await Promise.all([
      serverFetch<{ profile: Profile | null }>('/api/profile'),
      serverFetch<{ projects: Project[] }>('/api/projects?featured=true'),
      serverFetch<{ posts: BlogPost[] }>('/api/blog'),
    ]);
    profile = p.profile;
    projects = pr.projects;
    posts = b.posts.slice(0, 3);
  } catch {
    // API not running yet — render with empty state
  }

  return (
    <div className="space-y-16">
      <section className="pt-8 pb-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          {profile?.displayName ?? 'Alifur Rahman Jonayed'}
        </h1>
        {profile?.headline && (
          <p className="mt-3 text-lg text-[hsl(var(--muted-foreground))]">{profile.headline}</p>
        )}
        {profile?.about && (
          <p className="mt-6 max-w-2xl">{profile.about}</p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/projects" className="btn-primary">
            View Projects
          </Link>
          <Link href="/shop" className="btn-outline">
            Browse Shop
          </Link>
          <Link href="/contact" className="btn-ghost">
            Get in Touch
          </Link>
        </div>
      </section>

      {projects.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-2xl font-semibold">Featured Projects</h2>
            <Link className="text-sm underline hover:text-brand" href="/projects">
              All projects →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="card hover:border-brand transition-colors"
              >
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{p.summary}</p>
                {p.techStack.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.techStack.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="text-xs rounded bg-[hsl(var(--muted))] px-2 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-2xl font-semibold">Latest Posts</h2>
            <Link className="text-sm underline hover:text-brand" href="/blog">
              All posts →
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="card hover:border-brand transition-colors">
                <h3 className="font-semibold">{p.title}</h3>
                {p.excerpt && (
                  <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] line-clamp-3">
                    {p.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
