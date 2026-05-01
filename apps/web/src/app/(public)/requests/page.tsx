'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { CheckCircle2, Clock, MessageSquareText, Sparkles } from 'lucide-react';

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

const perks = [
  {
    Icon: Clock,
    title: '24-hour reply',
    body: "You'll hear back within a business day with next steps.",
  },
  {
    Icon: MessageSquareText,
    title: 'Real conversation',
    body: "I'll ask the right questions before quoting — no canned email.",
  },
  {
    Icon: Sparkles,
    title: 'No commitment',
    body: "Submitting a request is free. We only proceed when you're ready.",
  },
];

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

  return (
    <>
      <section className="relative overflow-hidden border-b border-[hsl(var(--border))]/60 bg-radial-fade">
        <div className="hero-grid absolute inset-0 opacity-60" aria-hidden />
        <div className="container-page relative py-16 sm:py-20">
          <span className="eyebrow">Requests</span>
          <h1 className="display-heading mt-4 text-4xl sm:text-5xl text-balance">
            Request a custom build.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[hsl(var(--muted-foreground))]">
            Have a template, plugin, or service in mind that isn&apos;t in the shop yet? Tell me
            what you need — I&apos;ll respond with a plan, scope, and rough estimate.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <aside className="space-y-4">
            {perks.map(({ Icon, title, body }) => (
              <div key={title} className="card">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500/15 to-indigo-500/10 text-brand-600 ring-1 ring-brand-500/20 dark:text-brand-300">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="display-heading mt-4 text-lg">{title}</h2>
                <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{body}</p>
              </div>
            ))}
          </aside>

          <div className="surface p-6 sm:p-8">
            {sent ? (
              <div className="flex flex-col items-start gap-4 py-6">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/30">
                  <CheckCircle2 className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="display-heading text-2xl">Request received</h2>
                  <p className="mt-2 text-[hsl(var(--muted-foreground))]">
                    Thanks! Your request has been logged. I&apos;ll reach out on the email or
                    WhatsApp number you provided.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="btn-outline mt-2"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="r-name">
                      Your name
                    </label>
                    <input
                      id="r-name"
                      required
                      className="input"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="r-email">
                      Email
                    </label>
                    <input
                      id="r-email"
                      required
                      type="email"
                      className="input"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@email.com"
                    />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="r-phone">
                      WhatsApp / contact number
                    </label>
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
                    <label className="label" htmlFor="r-budget">
                      Budget <span className="text-[hsl(var(--muted-foreground))]">(optional)</span>
                    </label>
                    <input
                      id="r-budget"
                      maxLength={100}
                      className="input"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      placeholder="$500, open to discuss, etc."
                    />
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="r-title">
                    Request title
                  </label>
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
                  <label className="label" htmlFor="r-description">
                    What do you need?
                  </label>
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
                <div className="flex items-center justify-between gap-4">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Sending…' : 'Send request'}
                  </button>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
