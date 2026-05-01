'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { Project } from '@/lib/types';

interface Draft {
  id?: string;
  title: string;
  slug?: string;
  summary: string;
  description: string;
  techStack: string;
  link: string;
  repoUrl: string;
  imageUrl: string;
  featured: boolean;
}

const empty: Draft = {
  title: '',
  summary: '',
  description: '',
  techStack: '',
  link: '',
  repoUrl: '',
  imageUrl: '',
  featured: false,
};

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [draft, setDraft] = useState<Draft>(empty);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await apiFetch<{ projects: Project[] }>('/api/projects');
    setItems(res.projects);
  }
  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: draft.title,
        slug: draft.slug || undefined,
        summary: draft.summary,
        description: draft.description,
        techStack: draft.techStack
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        link: draft.link || null,
        repoUrl: draft.repoUrl || null,
        imageUrl: draft.imageUrl || null,
        featured: draft.featured,
      };
      if (draft.id) {
        await apiFetch(`/api/projects/${draft.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch('/api/projects', { method: 'POST', body: JSON.stringify(payload) });
      }
      setDraft(empty);
      setEditing(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  function edit(p: Project) {
    setDraft({
      id: p.id,
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      description: p.description,
      techStack: p.techStack.join(', '),
      link: p.link ?? '',
      repoUrl: p.repoUrl ?? '',
      imageUrl: p.imageUrl ?? '',
      featured: p.featured,
    });
    setEditing(true);
  }

  async function remove(id: string) {
    if (!confirm('Delete this project?')) return;
    await apiFetch(`/api/projects/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          className="btn-primary mt-3"
          onClick={() => {
            setDraft(empty);
            setEditing(true);
          }}
        >
          + New project
        </button>
      </div>

      {editing && (
        <form onSubmit={save} className="card space-y-3">
          <Input label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} required />
          <Input label="Slug (optional)" value={draft.slug ?? ''} onChange={(v) => setDraft({ ...draft, slug: v })} />
          <Input label="Summary" value={draft.summary} onChange={(v) => setDraft({ ...draft, summary: v })} required />
          <Textarea label="Description" value={draft.description} onChange={(v) => setDraft({ ...draft, description: v })} required />
          <Input label="Tech stack (comma-separated)" value={draft.techStack} onChange={(v) => setDraft({ ...draft, techStack: v })} />
          <Input label="Live link" value={draft.link} onChange={(v) => setDraft({ ...draft, link: v })} />
          <Input label="Repo URL" value={draft.repoUrl} onChange={(v) => setDraft({ ...draft, repoUrl: v })} />
          <Input label="Image URL" value={draft.imageUrl} onChange={(v) => setDraft({ ...draft, imageUrl: v })} />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
            />
            Featured
          </label>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : draft.id ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setEditing(false);
                setDraft(empty);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <ul className="space-y-2">
        {items.map((p) => (
          <li key={p.id} className="card flex items-center justify-between">
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">/{p.slug}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-outline" onClick={() => edit(p)}>
                Edit
              </button>
              <button className="btn-ghost text-red-600" onClick={() => remove(p.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        className="input mt-1"
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea
        rows={5}
        className="input mt-1"
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
