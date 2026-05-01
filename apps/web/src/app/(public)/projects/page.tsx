import Link from 'next/link';
import { serverFetch } from '@/lib/api';
import type { Project } from '@/lib/types';

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
    <div>
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      {projects.length === 0 ? (
        <p className="text-[hsl(var(--muted-foreground))]">No projects yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.slug}`} className="card hover:border-brand transition-colors">
              <h2 className="font-semibold text-lg">{p.title}</h2>
              <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{p.summary}</p>
              {p.techStack.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.techStack.map((t) => (
                    <span key={t} className="text-xs rounded bg-[hsl(var(--muted))] px-2 py-0.5">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
