'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { BlogPost } from '@/lib/types';

interface Draft {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  status: 'DRAFT' | 'PUBLISHED';
  tags: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

function fromPost(p: BlogPost): Draft {
  return {
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? '',
    content: p.content,
    coverImageUrl: p.coverImageUrl ?? '',
    status: p.status,
    tags: p.tags.join(', '),
    metaTitle: p.metaTitle ?? '',
    metaDescription: p.metaDescription ?? '',
    metaKeywords: p.metaKeywords ?? '',
  };
}

const empty: Draft = {
  title: '',
  excerpt: '',
  content: '',
  coverImageUrl: '',
  status: 'DRAFT',
  tags: '',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
};

export default function PostEditor({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(post ? fromPost(post) : empty);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const payload = {
        title: draft.title,
        slug: draft.slug || undefined,
        excerpt: draft.excerpt || null,
        content: draft.content,
        coverImageUrl: draft.coverImageUrl || null,
        status: draft.status,
        tags: draft.tags
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        metaTitle: draft.metaTitle || null,
        metaDescription: draft.metaDescription || null,
        metaKeywords: draft.metaKeywords || null,
      };
      if (post) {
        await apiFetch(`/api/blog/${post.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setMsg('Saved.');
      } else {
        await apiFetch('/api/blog', { method: 'POST', body: JSON.stringify(payload) });
        router.push('/admin/blog');
        router.refresh();
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">{post ? 'Edit post' : 'New post'}</h1>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="label">Title</label>
          <input
            className="input mt-1"
            required
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Slug (optional)</label>
          <input
            className="input mt-1"
            value={draft.slug ?? ''}
            onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Excerpt</label>
          <input
            className="input mt-1"
            value={draft.excerpt}
            onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Content (Markdown)</label>
          <textarea
            rows={14}
            className="input mt-1 font-mono text-sm"
            required
            value={draft.content}
            onChange={(e) => setDraft({ ...draft, content: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Cover image URL</label>
          <input
            className="input mt-1"
            value={draft.coverImageUrl}
            onChange={(e) => setDraft({ ...draft, coverImageUrl: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Tags (comma-separated)</label>
          <input
            className="input mt-1"
            value={draft.tags}
            onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Status</label>
          <select
            className="input mt-1"
            value={draft.status}
            onChange={(e) => setDraft({ ...draft, status: e.target.value as Draft['status'] })}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
        <fieldset className="border border-[hsl(var(--border))] rounded-md p-4">
          <legend className="text-sm font-medium px-1">SEO</legend>
          <div className="space-y-3">
            <div>
              <label className="label">Meta title</label>
              <input
                className="input mt-1"
                value={draft.metaTitle}
                onChange={(e) => setDraft({ ...draft, metaTitle: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Meta description</label>
              <textarea
                rows={2}
                className="input mt-1"
                value={draft.metaDescription}
                onChange={(e) => setDraft({ ...draft, metaDescription: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Meta keywords (comma-separated)</label>
              <input
                className="input mt-1"
                value={draft.metaKeywords}
                onChange={(e) => setDraft({ ...draft, metaKeywords: e.target.value })}
              />
            </div>
          </div>
        </fieldset>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save post'}
        </button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </div>
  );
}
