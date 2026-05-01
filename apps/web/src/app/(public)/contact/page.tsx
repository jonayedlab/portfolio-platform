'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { CheckCircle2, Mail, MessageSquare } from 'lucide-react';

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

  return (
    <>
      <section className="relative overflow-hidden border-b border-[hsl(var(--border))]/60 bg-radial-fade">
        <div className="hero-grid absolute inset-0 opacity-60" aria-hidden />
        <div className="container-page relative py-16 sm:py-20">
          <span className="eyebrow">Contact</span>
          <h1 className="display-heading mt-4 text-4xl sm:text-5xl text-balance">
            Let&apos;s talk about your project.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[hsl(var(--muted-foreground))]">
            Drop a quick message and I&apos;ll get back within 24 hours. For full project briefs,
            try{' '}
            <a href="/requests" className="text-brand-600 underline underline-offset-4 dark:text-brand-300">
              the request form
            </a>
            {' '}— it captures the details I need to give you a proper estimate.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <aside className="space-y-4">
            <div className="card">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500/15 to-indigo-500/10 text-brand-600 ring-1 ring-brand-500/20 dark:text-brand-300">
                <Mail className="h-5 w-5" />
              </span>
              <h2 className="display-heading mt-4 text-lg">Direct email</h2>
              <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                For partnerships, press, or longer conversations.
              </p>
              <a href="mailto:hello@example.com" className="btn-link mt-4 inline-flex">
                hello@example.com
              </a>
            </div>
            <div className="card">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-500/15 to-rose-500/10 text-amber-600 ring-1 ring-amber-500/20">
                <MessageSquare className="h-5 w-5" />
              </span>
              <h2 className="display-heading mt-4 text-lg">Project request</h2>
              <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                Got a build in mind? Submit a structured request and I&apos;ll reply with a plan.
              </p>
              <a href="/requests" className="btn-outline mt-4 inline-flex">
                Open the form
              </a>
            </div>
          </aside>

          <div className="surface p-6 sm:p-8">
            {sent ? (
              <div className="flex flex-col items-start gap-4 py-6">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/30">
                  <CheckCircle2 className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="display-heading text-2xl">Message sent</h2>
                  <p className="mt-2 text-[hsl(var(--muted-foreground))]">
                    Thanks for reaching out. I&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="contact-name">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      required
                      className="input"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="contact-email">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      required
                      type="email"
                      className="input"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="contact-subject">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    className="input"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="contact-body">
                    Message
                  </label>
                  <textarea
                    id="contact-body"
                    required
                    rows={6}
                    className="input"
                    value={form.body}
                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                    placeholder="Tell me a bit about what you're working on..."
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Sending…' : 'Send message'}
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
