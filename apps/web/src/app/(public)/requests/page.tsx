'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';

interface Form {
  name: string;
  email: string;
  phone: string;
  title: string;
  description: string;
  budget: string;
}

const empty: Form = {
  name: '',
  email: '',
  phone: '',
  title: '',
  description: '',
  budget: '',
};

export default function RequestsPage() {
  const [form, setForm] = useState<Form>(empty);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiFetch('/api/product-requests', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          title: form.title,
          description: form.description,
          budget: form.budget || null,
        }),
      });
      setSent(true);
      setForm(empty);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="max-w-xl">
        <h1 className="text-3xl font-bold">Request received</h1>
        <p className="mt-3">
          Thanks! Your request has been logged. I&apos;ll reach out on the email or WhatsApp number
          you provided.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="btn-outline mt-6"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold">Request a product</h1>
      <p className="mt-2 text-[hsl(var(--muted-foreground))]">
        Have a template, plugin, or service in mind that isn&apos;t in the shop yet? Tell me what
        you need and I&apos;ll get back to you.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="r-name">Your name</label>
          <input
            id="r-name"
            required
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="label" htmlFor="r-email">Email</label>
          <input
            id="r-email"
            required
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="label" htmlFor="r-phone">WhatsApp / contact number</label>
          <input
            id="r-phone"
            required
            type="tel"
            inputMode="tel"
            minLength={5}
            maxLength={40}
            className="input"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+880 1XXX-XXXXXX"
          />
        </div>
        <div>
          <label className="label" htmlFor="r-title">Request title</label>
          <input
            id="r-title"
            required
            minLength={3}
            maxLength={200}
            className="input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. SaaS landing page template"
          />
        </div>
        <div>
          <label className="label" htmlFor="r-description">What do you need?</label>
          <textarea
            id="r-description"
            required
            rows={6}
            minLength={10}
            maxLength={5000}
            className="input"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the product, features, tech stack preferences, and timeline."
          />
        </div>
        <div>
          <label className="label" htmlFor="r-budget">Budget (optional)</label>
          <input
            id="r-budget"
            maxLength={100}
            className="input"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            placeholder="$500, open to discuss, etc."
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Sending…' : 'Send request'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
