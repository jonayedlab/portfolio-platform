import { notFound } from 'next/navigation';
import Link from 'next/link';
import { serverFetch } from '@/lib/api';
import type { BlogPost } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const { post } = await serverFetch<{ post: BlogPost }>(`/api/blog/${params.slug}`);
    return {
      title: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt ?? undefined,
      keywords: post.metaKeywords ?? undefined,
      openGraph: {
        title: post.metaTitle ?? post.title,
        description: post.metaDescription ?? post.excerpt ?? undefined,
        type: 'article',
        publishedTime: post.publishedAt ?? undefined,
      },
    };
  } catch {
    return { title: 'Post not found' };
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  let post: BlogPost | null = null;
  try {
    post = (await serverFetch<{ post: BlogPost }>(`/api/blog/${params.slug}`)).post;
  } catch {
    post = null;
  }
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.publishedAt ?? post.createdAt,
    author: { '@type': 'Person', name: post.author?.name ?? 'Author' },
    description: post.metaDescription ?? post.excerpt ?? undefined,
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-[hsl(var(--border))]/60 bg-radial-fade">
        <div className="hero-grid absolute inset-0 opacity-50" aria-hidden />
        <div className="container-page relative py-12 sm:py-16">
          <Link href="/blog" className="btn-link mb-6 inline-flex">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to blog
          </Link>
          <span className="eyebrow">
            {formatDate(post.publishedAt ?? post.createdAt)}
            {post.category && <span> · {post.category.name}</span>}
          </span>
          <h1 className="display-heading mt-4 text-3xl sm:text-5xl text-balance">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-4 max-w-2xl text-lg text-[hsl(var(--muted-foreground))]">
              {post.excerpt}
            </p>
          )}
          {post.author?.name && (
            <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">
              By <span className="text-[hsl(var(--foreground))]">{post.author.name}</span>
            </p>
          )}
        </div>
      </section>

      <section className="container-page py-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {post.coverImageUrl && (
          <div className="surface mb-10 overflow-hidden p-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full object-cover"
            />
          </div>
        )}
        <article className="prose-blog mx-auto max-w-3xl whitespace-pre-line">
          {post.content}
        </article>
        {post.tags.length > 0 && (
          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span key={t} className="chip">
                #{t}
              </span>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
