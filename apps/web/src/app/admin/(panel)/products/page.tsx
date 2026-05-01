'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface Draft {
  id?: string;
  name: string;
  slug?: string;
  description: string;
  priceCents: number;
  currency: string;
  fileUrl: string;
  imageUrl: string;
  published: boolean;
}

const empty: Draft = {
  name: '',
  description: '',
  priceCents: 0,
  currency: 'USD',
  fileUrl: '',
  imageUrl: '',
  published: true,
};

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [draft, setDraft] = useState<Draft>(empty);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await apiFetch<{ products: Product[] }>('/api/products?all=true');
    setItems(res.products);
  }
  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: draft.name,
        slug: draft.slug || undefined,
        description: draft.description,
        priceCents: Number(draft.priceCents),
        currency: draft.currency,
        fileUrl: draft.fileUrl || null,
        imageUrl: draft.imageUrl || null,
        published: draft.published,
      };
      if (draft.id) {
        await apiFetch(`/api/products/${draft.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch('/api/products', { method: 'POST', body: JSON.stringify(payload) });
      }
      setDraft(empty);
      setEditing(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  function edit(p: Product) {
    setDraft({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      priceCents: p.priceCents,
      currency: p.currency,
      fileUrl: '',
      imageUrl: p.imageUrl ?? '',
      published: p.published,
    });
    setEditing(true);
  }

  async function remove(id: string) {
    if (!confirm('Delete this product?')) return;
    await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          className="btn-primary mt-3"
          onClick={() => {
            setDraft(empty);
            setEditing(true);
          }}
        >
          + New product
        </button>
      </div>

      {editing && (
        <form onSubmit={save} className="card space-y-3">
          <div>
            <label className="label">Name</label>
            <input
              className="input mt-1"
              required
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
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
            <label className="label">Description</label>
            <textarea
              rows={5}
              className="input mt-1"
              required
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Price (cents)</label>
              <input
                className="input mt-1"
                type="number"
                min={0}
                value={draft.priceCents}
                onChange={(e) => setDraft({ ...draft, priceCents: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="label">Currency</label>
              <input
                className="input mt-1"
                value={draft.currency}
                onChange={(e) => setDraft({ ...draft, currency: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="label">File URL (digital download)</label>
            <input
              className="input mt-1"
              value={draft.fileUrl}
              onChange={(e) => setDraft({ ...draft, fileUrl: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Image URL</label>
            <input
              className="input mt-1"
              value={draft.imageUrl}
              onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
            />
            Published
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
              <p className="font-medium">
                {p.name}{' '}
                <span className="text-xs text-[hsl(var(--muted-foreground))]">/{p.slug}</span>
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                {formatPrice(p.priceCents, p.currency)}{' '}
                {!p.published && <span className="text-amber-600">· draft</span>}
              </p>
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
