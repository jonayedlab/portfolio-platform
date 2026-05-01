import { notFound } from 'next/navigation';
import Link from 'next/link';
import { serverFetch } from '@/lib/api';
import type { Project } from '@/lib/types';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';

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
    <>
      <section className="relative overflow-hidden border-b border-[hsl(var(--border))]/60 bg-radial-fade">
        <div className="hero-grid absolute inset-0 opacity-50" aria-hidden />
        <div className="container-page relative py-12 sm:py-16">
          <Link href="/projects" className="btn-link mb-6 inline-flex">
            <ArrowLeft className="h-3.5 w-3.5" />
            All projects
          </Link>
          <span className="eyebrow">Project</span>
          <h1 className="display-heading mt-4 text-3xl sm:text-5xl text-balance">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[hsl(var(--muted-foreground))]">
            {project.summary}
          </p>
          {project.techStack.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.techStack.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            {project.link && (
              <a
                href={project.link}
                className="btn-primary"
                target="_blank"
                rel="noreferrer"
              >
                Visit live <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                className="btn-outline"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="h-4 w-4" />
                Repository
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        {project.imageUrl && (
          <div className="surface mb-10 overflow-hidden p-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full object-cover"
            />
          </div>
        )}
        <article className="prose-blog max-w-3xl whitespace-pre-line">
          {project.description}
        </article>
      </section>
    </>
  );
}
