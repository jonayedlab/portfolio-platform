'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { Profile } from '@/lib/types';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ profile: Profile | null }>('/api/profile')
      .then((d) => setProfile(d.profile))
      .catch(() => setProfile(null));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setMsg(null);
    try {
      const payload = {
        displayName: profile.displayName,
        headline: profile.headline,
        about: profile.about,
        photoUrl: profile.photoUrl,
        address: profile.address,
        email: profile.email,
        phone: profile.phone,
        websiteUrl: profile.websiteUrl,
        socials: profile.socials ?? {},
      };
      const res = await apiFetch<{ profile: Profile }>('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      setProfile({ ...profile, ...res.profile });
      setMsg('Saved.');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (!profile) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <form onSubmit={save} className="space-y-4">
        <Field label="Display name">
          <input
            className="input"
            value={profile.displayName}
            onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
          />
        </Field>
        <Field label="Headline">
          <input
            className="input"
            value={profile.headline ?? ''}
            onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
          />
        </Field>
        <Field label="About">
          <textarea
            rows={6}
            className="input"
            value={profile.about ?? ''}
            onChange={(e) => setProfile({ ...profile, about: e.target.value })}
          />
        </Field>
        <Field label="Photo URL">
          <input
            className="input"
            value={profile.photoUrl ?? ''}
            onChange={(e) => setProfile({ ...profile, photoUrl: e.target.value })}
          />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Email">
            <input
              type="email"
              className="input"
              value={profile.email ?? ''}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </Field>
          <Field label="Phone">
            <input
              className="input"
              value={profile.phone ?? ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Address">
          <input
            className="input"
            value={profile.address ?? ''}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
          />
        </Field>
        <Field label="Website">
          <input
            className="input"
            value={profile.websiteUrl ?? ''}
            onChange={(e) => setProfile({ ...profile, websiteUrl: e.target.value })}
          />
        </Field>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
