import { serverFetch } from '@/lib/api';
import type { Profile } from '@/lib/types';
import PageHeader from '@/components/PageHeader';
import { Briefcase, GraduationCap, MapPin, Mail, Phone, Globe } from 'lucide-react';

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
      <>
        <PageHeader
          eyebrow="About"
          title="About"
          description="Profile not configured yet. Sign in to the admin panel to set it up."
        />
      </>
    );
  }

  const initials = profile.displayName
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Group skills by category for the grid
  const skillGroups = profile.skills.reduce<Record<string, typeof profile.skills>>(
    (acc, s) => {
      const key = s.category ?? 'General';
      acc[key] ??= [];
      acc[key].push(s);
      return acc;
    },
    {},
  );

  return (
    <>
      <PageHeader
        eyebrow="About"
        title={profile.displayName}
        description={profile.headline ?? undefined}
      />

      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            {profile.about && (
              <div className="prose-blog whitespace-pre-line">{profile.about}</div>
            )}
          </div>

          <aside className="space-y-3">
            <div className="surface p-6">
              <div className="flex items-center gap-4">
                {profile.photoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={profile.photoUrl}
                    alt={profile.displayName}
                    className="h-14 w-14 rounded-2xl object-cover ring-2 ring-[hsl(var(--border))]"
                  />
                ) : (
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-lg font-semibold text-white shadow-glow">
                    {initials || 'AJ'}
                  </div>
                )}
                <div>
                  <p className="font-semibold tracking-tight">{profile.displayName}</p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                    {profile.headline ?? 'Full-stack developer'}
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-2 text-sm">
                {profile.address && (
                  <ContactRow Icon={MapPin}>{profile.address}</ContactRow>
                )}
                {profile.email && (
                  <ContactRow Icon={Mail}>
                    <a className="hover:text-brand-600" href={`mailto:${profile.email}`}>
                      {profile.email}
                    </a>
                  </ContactRow>
                )}
                {profile.phone && (
                  <ContactRow Icon={Phone}>
                    <a className="hover:text-brand-600" href={`tel:${profile.phone}`}>
                      {profile.phone}
                    </a>
                  </ContactRow>
                )}
                {profile.websiteUrl && (
                  <ContactRow Icon={Globe}>
                    <a
                      className="hover:text-brand-600"
                      href={profile.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {profile.websiteUrl.replace(/^https?:\/\//, '')}
                    </a>
                  </ContactRow>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {Object.keys(skillGroups).length > 0 && (
        <section className="border-y border-[hsl(var(--border))]/60 bg-[hsl(var(--card))]/30">
          <div className="container-page py-16">
            <div className="max-w-2xl">
              <span className="eyebrow">Skills</span>
              <h2 className="section-title mt-3">Tools &amp; expertise</h2>
              <p className="section-lead">
                The stack I work with day-to-day, grouped by where it shows up in a project.
              </p>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              {Object.entries(skillGroups).map(([category, list]) => (
                <div key={category} className="card">
                  <h3 className="display-heading text-lg">{category}</h3>
                  <ul className="mt-4 space-y-3">
                    {list
                      .sort((a, b) => a.order - b.order)
                      .map((s) => (
                        <li key={s.id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{s.name}</span>
                            <span className="text-xs text-[hsl(var(--muted-foreground))]">
                              {s.level}/5
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-[width] duration-700"
                              style={{ width: `${(Math.max(0, Math.min(5, s.level)) / 5) * 100}%` }}
                            />
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {profile.experiences.length > 0 && (
        <section className="container-page py-16">
          <div className="max-w-2xl">
            <span className="eyebrow">Experience</span>
            <h2 className="section-title mt-3">A timeline of work</h2>
          </div>
          <ol className="relative mt-10 space-y-4 border-l border-[hsl(var(--border))] pl-6 sm:pl-8">
            {profile.experiences
              .sort((a, b) => a.order - b.order)
              .map((e) => (
                <li key={e.id} className="relative">
                  <span className="absolute -left-[33px] top-2 grid h-6 w-6 place-items-center rounded-full bg-[hsl(var(--card))] ring-2 ring-[hsl(var(--border))] sm:-left-[37px]">
                    <Briefcase className="h-3 w-3 text-brand-600 dark:text-brand-300" />
                  </span>
                  <div className="card-hover">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="display-heading text-lg">
                        {e.role}{' '}
                        <span className="text-[hsl(var(--muted-foreground))]">· {e.company}</span>
                      </h3>
                      <span className="chip">
                        {e.startYear ?? ''}
                        {e.startYear ? ' – ' : ''}
                        {e.current ? 'Present' : (e.endYear ?? '')}
                      </span>
                    </div>
                    {e.description && (
                      <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
                        {e.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
          </ol>
        </section>
      )}

      {profile.qualifications.length > 0 && (
        <section className="container-page pb-24 pt-8">
          <div className="max-w-2xl">
            <span className="eyebrow">Education</span>
            <h2 className="section-title mt-3">Qualifications</h2>
          </div>
          <ol className="relative mt-10 space-y-4 border-l border-[hsl(var(--border))] pl-6 sm:pl-8">
            {profile.qualifications
              .sort((a, b) => a.order - b.order)
              .map((q) => (
                <li key={q.id} className="relative">
                  <span className="absolute -left-[33px] top-2 grid h-6 w-6 place-items-center rounded-full bg-[hsl(var(--card))] ring-2 ring-[hsl(var(--border))] sm:-left-[37px]">
                    <GraduationCap className="h-3 w-3 text-brand-600 dark:text-brand-300" />
                  </span>
                  <div className="card-hover">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="display-heading text-lg">
                        {q.title}{' '}
                        <span className="text-[hsl(var(--muted-foreground))]">
                          · {q.institution}
                        </span>
                      </h3>
                      <span className="chip">
                        {q.startYear ?? ''}
                        {q.startYear && q.endYear ? ' – ' : ''}
                        {q.endYear ?? ''}
                      </span>
                    </div>
                    {q.description && (
                      <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
                        {q.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
          </ol>
        </section>
      )}
    </>
  );
}

function ContactRow({
  Icon,
  children,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2.5 text-[hsl(var(--muted-foreground))]">
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span className="text-[hsl(var(--foreground))]">{children}</span>
    </li>
  );
}
