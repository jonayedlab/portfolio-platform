'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', body: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiFetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="max-w-xl">
        <h1 className="text-3xl font-bold">Thanks!</h1>
        <p className="mt-3">Your message has been sent. I&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-2 text-[hsl(var(--muted-foreground))]">
        Send a project request, question, or just say hi.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label className="label">Name</label>
          <input
            required
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            required
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Subject</label>
          <input
            className="input"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Message</label>
          <textarea
            required
            rows={6}
            className="input"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Sending…' : 'Send'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
