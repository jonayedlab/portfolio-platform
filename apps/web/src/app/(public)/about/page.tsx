import { serverFetch } from '@/lib/api';
import type { Profile } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'About',
  description: 'Background, experience, and skills.',
};

export default async function AboutPage() {
  let profile: Profile | null = null;
  try {
    profile = (await serverFetch<{ profile: Profile | null }>('/api/profile')).profile;
  } catch {
    profile = null;
  }

  if (!profile) {
    return (
      <div>
        <h1 className="text-3xl font-bold">About</h1>
        <p className="mt-4 text-[hsl(var(--muted-foreground))]">
          Profile not configured yet. Sign in to the admin panel to set it up.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl font-bold">About</h1>
        {profile.headline && (
          <p className="mt-2 text-[hsl(var(--muted-foreground))]">{profile.headline}</p>
        )}
        {profile.about && <p className="mt-4 max-w-2xl whitespace-pre-line">{profile.about}</p>}
      </section>

      {profile.skills.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Skills</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {profile.skills.map((s) => (
              <li key={s.id} className="card py-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {'★'.repeat(s.level)}
                  </span>
                </div>
                {s.category && (
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{s.category}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {profile.experiences.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Experience</h2>
          <ul className="space-y-3">
            {profile.experiences.map((e) => (
              <li key={e.id} className="card">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-semibold">
                    {e.role} <span className="text-[hsl(var(--muted-foreground))]">· {e.company}</span>
                  </h3>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {e.startYear ?? ''}{e.startYear ? ' – ' : ''}{e.current ? 'Present' : (e.endYear ?? '')}
                  </span>
                </div>
                {e.description && <p className="mt-2 text-sm">{e.description}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {profile.qualifications.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Qualifications</h2>
          <ul className="space-y-3">
            {profile.qualifications.map((q) => (
              <li key={q.id} className="card">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-semibold">
                    {q.title}{' '}
                    <span className="text-[hsl(var(--muted-foreground))]">· {q.institution}</span>
                  </h3>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {q.startYear ?? ''}{q.startYear && q.endYear ? ' – ' : ''}{q.endYear ?? ''}
                  </span>
                </div>
                {q.description && <p className="mt-2 text-sm">{q.description}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
