'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  body: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [items, setItems] = useState<Message[]>([]);

  async function load() {
    const res = await apiFetch<{ messages: Message[] }>('/api/messages');
    setItems(res.messages);
  }
  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  async function markRead(id: string) {
    await apiFetch(`/api/messages/${id}/read`, { method: 'PUT' });
    await load();
  }
  async function remove(id: string) {
    if (!confirm('Delete this message?')) return;
    await apiFetch(`/api/messages/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <h1 className="text-2xl font-bold">Messages</h1>
      {items.length === 0 ? (
        <p className="text-[hsl(var(--muted-foreground))]">No messages yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((m) => (
            <li key={m.id} className="card">
              <div className="flex items-baseline justify-between">
                <p className="font-medium">
                  {m.name} <span className="text-[hsl(var(--muted-foreground))]">·</span>{' '}
                  <a className="underline" href={`mailto:${m.email}`}>
                    {m.email}
                  </a>
                  {!m.read && (
                    <span className="ml-2 text-xs rounded bg-amber-200 text-amber-900 px-2 py-0.5">
                      new
                    </span>
                  )}
                </p>
                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                  {new Date(m.createdAt).toLocaleString()}
                </span>
              </div>
              {m.subject && <p className="mt-1 text-sm font-medium">{m.subject}</p>}
              <p className="mt-2 text-sm whitespace-pre-line">{m.body}</p>
              <div className="mt-3 flex gap-2">
                {!m.read && (
                  <button className="btn-outline" onClick={() => markRead(m.id)}>
                    Mark as read
                  </button>
                )}
                <button className="btn-ghost text-red-600" onClick={() => remove(m.id)}>
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
