import Link from 'next/link';
import { serverFetch } from '@/lib/api';
import type { Project } from '@/lib/types';
import PageHeader from '@/components/PageHeader';
import { ArrowRight, Folder } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Projects' };

export default async function ProjectsPage() {
  let projects: Project[] = [];
  try {
    projects = (await serverFetch<{ projects: Project[] }>('/api/projects')).projects;
  } catch {
    projects = [];
  }
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Selected work"
        description="Products, platforms, and experiments — built with care, shipped end to end."
      />

      <section className="container-page py-16">
        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            body="Projects will show up here once they're added from the admin panel."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="card-hover group flex flex-col overflow-hidden p-0"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-brand-500/10 via-indigo-500/10 to-transparent">
                  {p.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="display-heading text-3xl text-[hsl(var(--foreground))]/30">
                        {p.title.slice(0, 1)}
                      </span>
                    </div>
                  )}
                  {p.featured && (
                    <span className="absolute left-3 top-3 chip-brand backdrop-blur">Featured</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="display-heading text-lg">{p.title}</h2>
                  <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] line-clamp-3">
                    {p.summary}
                  </p>
                  {p.techStack.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.techStack.slice(0, 5).map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="btn-link mt-5 inline-flex text-brand-600 dark:text-brand-300">
                    View case study <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="card mx-auto max-w-md text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
        <Folder className="h-5 w-5" />
      </span>
      <h2 className="display-heading mt-4 text-lg">{title}</h2>
      <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{body}</p>
    </div>
  );
}
