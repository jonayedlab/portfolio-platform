import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/api';
import type { BlogPost } from '@/lib/types';
import { formatDate } from '@/lib/utils';

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
    <article className="max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
          {formatDate(post.publishedAt ?? post.createdAt)}
          {post.author?.name && <span> · {post.author.name}</span>}
        </p>
      </header>
      <div className="prose-blog whitespace-pre-line">{post.content}</div>
      {post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-1">
          {post.tags.map((t) => (
            <span key={t} className="text-xs rounded bg-[hsl(var(--muted))] px-2 py-0.5">
              #{t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
