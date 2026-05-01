'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { ProductRequest, ProductRequestStatus } from '@/lib/types';

const STATUSES: ProductRequestStatus[] = [
  'NEW',
  'IN_REVIEW',
  'ACCEPTED',
  'REJECTED',
  'DONE',
];

export default function AdminProductRequestsPage() {
  const [items, setItems] = useState<ProductRequest[]>([]);
  const [filter, setFilter] = useState<'ALL' | ProductRequestStatus>('ALL');

  async function load() {
    const res = await apiFetch<{ requests: ProductRequest[] }>('/api/product-requests');
    setItems(res.requests);
  }
  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  async function setStatus(id: string, status: ProductRequestStatus) {
    await apiFetch(`/api/product-requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this request?')) return;
    await apiFetch(`/api/product-requests/${id}`, { method: 'DELETE' });
    await load();
  }

  const visible = filter === 'ALL' ? items : items.filter((r) => r.status === filter);

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Product requests</h1>
        <div className="flex items-center gap-2">
          <label className="label" htmlFor="filter">Status</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'ALL' | ProductRequestStatus)}
            className="input"
          >
            <option value="ALL">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      {visible.length === 0 ? (
        <p className="text-[hsl(var(--muted-foreground))]">No requests {filter === 'ALL' ? 'yet' : `with status ${filter}`}.</p>
      ) : (
        <ul className="space-y-2">
          {visible.map((r) => (
            <li key={r.id} className="card">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    {r.name} ·{' '}
                    <a className="underline" href={`mailto:${r.email}`}>
                      {r.email}
                    </a>{' '}
                    ·{' '}
                    <a className="underline" href={`tel:${r.phone}`}>
                      {r.phone}
                    </a>
                  </p>
                </div>
                <span className="text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                  {new Date(r.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-sm whitespace-pre-line">{r.description}</p>
              {r.budget && (
                <p className="mt-2 text-xs">
                  <span className="text-[hsl(var(--muted-foreground))]">Budget:</span> {r.budget}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <select
                  value={r.status}
                  onChange={(e) => setStatus(r.id, e.target.value as ProductRequestStatus)}
                  className="input max-w-[10rem]"
                  aria-label="Status"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button className="btn-ghost text-red-600" onClick={() => remove(r.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
