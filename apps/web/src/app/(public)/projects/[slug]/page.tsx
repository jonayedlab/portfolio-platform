import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/api';
import type { Project } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const { project } = await serverFetch<{ project: Project }>(`/api/projects/${params.slug}`);
    return { title: project.title, description: project.summary };
  } catch {
    return { title: 'Project not found' };
  }
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  let project: Project | null = null;
  try {
    project = (await serverFetch<{ project: Project }>(`/api/projects/${params.slug}`)).project;
  } catch {
    project = null;
  }
  if (!project) notFound();

  return (
    <article className="max-w-3xl">
      <h1 className="text-3xl font-bold">{project.title}</h1>
      <p className="mt-2 text-[hsl(var(--muted-foreground))]">{project.summary}</p>
      {project.techStack.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1">
          {project.techStack.map((t) => (
            <span key={t} className="text-xs rounded bg-[hsl(var(--muted))] px-2 py-0.5">
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="prose-blog mt-8 whitespace-pre-line">{project.description}</div>
      <div className="mt-8 flex flex-wrap gap-3">
        {project.link && (
          <a href={project.link} className="btn-primary" target="_blank" rel="noreferrer">
            Live →
          </a>
        )}
        {project.repoUrl && (
          <a href={project.repoUrl} className="btn-outline" target="_blank" rel="noreferrer">
            Repository
          </a>
        )}
      </div>
    </article>
  );
}
