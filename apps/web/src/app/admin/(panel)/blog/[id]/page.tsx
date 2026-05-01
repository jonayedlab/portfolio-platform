import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/api';
import type { BlogPost } from '@/lib/types';
import PostEditor from '../PostEditor';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  // The blog list endpoint returns by id only via slug normally; but we have
  // posts list with all=true that we can search. Simpler: try slug == id first,
  // then fall back to scanning all posts.
  let post: BlogPost | null = null;
  try {
    const all = await serverFetch<{ posts: BlogPost[] }>('/api/blog?all=true');
    post = all.posts.find((p) => p.id === params.id) ?? null;
  } catch {
    post = null;
  }
  if (!post) notFound();
  return <PostEditor post={post} />;
}
