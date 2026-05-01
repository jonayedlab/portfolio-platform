import Link from 'next/link';
import { serverFetch } from '@/lib/api';
import type { Profile, Project, BlogPost, Product } from '@/lib/types';
import { formatDate, formatPrice } from '@/lib/utils';
import {
  ArrowRight,
  Sparkles,
  Code2,
  Layers,
  ShoppingBag,
  PenSquare,
  Rocket,
  Star,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const expertise = [
  {
    Icon: Code2,
    title: 'Full-stack engineering',
    body: 'Next.js 14, TypeScript, Express, and Prisma — production-grade apps with thoughtful architecture.',
  },
  {
    Icon: Layers,
    title: 'Product design systems',
    body: 'Tokenised, accessible UI built on Tailwind and shadcn — fast to ship, easy to extend.',
  },
  {
    Icon: ShoppingBag,
    title: 'Digital products & shop',
    body: 'Templates, plugins, and tooling — checkout flows, secure delivery, admin CMS, the works.',
  },
  {
    Icon: PenSquare,
    title: 'Writing & teaching',
    body: 'Long-form posts on building real-world software. Pragmatic, clear, and code-first.',
  },
];

export default async function HomePage() {
  let profile: Profile | null = null;
  let projects: Project[] = [];
  let posts: BlogPost[] = [];
  let products: Product[] = [];
  let totalProjects = 0;
  let totalPosts = 0;
  let totalProducts = 0;
  try {
    const [p, pr, b, sh] = await Promise.all([
      serverFetch<{ profile: Profile | null }>('/api/profile'),
      serverFetch<{ projects: Project[] }>('/api/projects?featured=true'),
      serverFetch<{ posts: BlogPost[] }>('/api/blog'),
      serverFetch<{ products: Product[] }>('/api/products'),
    ]);
    profile = p.profile;
    totalProjects = pr.projects.length;
    totalPosts = b.posts.length;
    totalProducts = sh.products.length;
    projects = pr.projects.slice(0, 3);
    posts = b.posts.slice(0, 3);
    products = sh.products.slice(0, 3);
  } catch {
    // API not running yet — render with empty state
  }

  const displayName = profile?.displayName ?? 'Alifur Rahman Jonayed';
  const headline =
    profile?.headline ??
    'Full-stack developer building thoughtful, performant web platforms.';
  const initials = displayName
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const stats = [
    { value: totalProjects || '—', label: 'Projects shipped' },
    { value: totalPosts || '—', label: 'Posts written' },
    { value: totalProducts || '—', label: 'Digital products' },
    { value: '24h', label: 'Reply window' },
  ];

  const topSkills = (profile?.skills ?? []).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[hsl(var(--border))]/60">
        <div className="hero-grid absolute inset-0 opacity-70" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-[520px] bg-radial-fade" aria-hidden />
        <div className="container-page relative py-20 sm:py-24 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div className="animate-fade-up">
              <span className="eyebrow">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Available for new work
              </span>
              <h1 className="display-heading mt-5 text-4xl sm:text-5xl lg:text-6xl text-balance">
                Building digital products with
                {' '}
                <span className="gradient-text">craft, clarity, and care</span>.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-[hsl(var(--muted-foreground))] text-pretty">
                {headline} I design, build, and ship full-stack web platforms — from
                portfolio sites to digital storefronts and content systems.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/projects" className="btn-primary">
                  View projects
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/requests" className="btn-outline">
                  Request a build
                </Link>
                <Link href="/contact" className="btn-ghost">
                  Get in touch
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[hsl(var(--muted-foreground))]">
                <span className="flex items-center gap-1.5 font-medium text-[hsl(var(--foreground))]">
                  <Star className="h-4 w-4 fill-amber-400 stroke-amber-500" />
                  <Star className="h-4 w-4 fill-amber-400 stroke-amber-500" />
                  <Star className="h-4 w-4 fill-amber-400 stroke-amber-500" />
                  <Star className="h-4 w-4 fill-amber-400 stroke-amber-500" />
                  <Star className="h-4 w-4 fill-amber-400 stroke-amber-500" />
                </span>
                <span>Trusted by founders and indie teams shipping their first product.</span>
              </div>
            </div>

            {/* Profile card */}
            <div className="relative mx-auto w-full max-w-sm animate-scale-in">
              <div
                className="absolute -inset-6 -z-10 rounded-[2rem] opacity-60 blur-2xl"
                style={{
                  background:
                    'radial-gradient(60% 60% at 50% 30%, hsl(var(--brand-glow) / 0.55), transparent 70%)',
                }}
                aria-hidden
              />
              <div className="surface relative overflow-hidden p-6">
                <div className="flex items-center gap-4">
                  {profile?.photoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={profile.photoUrl}
                      alt={displayName}
                      className="h-16 w-16 rounded-2xl object-cover ring-2 ring-[hsl(var(--border))]"
                    />
                  ) : (
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-xl font-semibold text-white shadow-glow">
                      {initials || 'AJ'}
                    </div>
                  )}
                  <div>
                    <p className="text-base font-semibold tracking-tight">{displayName}</p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      {profile?.headline ?? 'Full-stack developer · Bangladesh'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50 p-3">
                  {[
                    { label: 'Projects', value: totalProjects || '—' },
                    { label: 'Posts', value: totalPosts || '—' },
                    { label: 'Years', value: '5+' },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="display-heading text-xl text-[hsl(var(--foreground))]">
                        {s.value}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                {(topSkills.length > 0 ? topSkills.map((s) => s.name) : [
                  'Next.js',
                  'TypeScript',
                  'Tailwind',
                  'Prisma',
                  'PostgreSQL',
                  'Node.js',
                ]).length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {(topSkills.length > 0
                      ? topSkills.map((s) => s.name)
                      : ['Next.js', 'TypeScript', 'Tailwind', 'Prisma', 'PostgreSQL', 'Node.js']
                    ).map((label) => (
                      <span key={label} className="chip-brand">
                        {label}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href="/about"
                  className="btn-link mt-6 inline-flex"
                >
                  More about me <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Floating accent badges */}
              <div className="absolute -left-6 top-10 hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-xs font-medium shadow-elevated sm:flex sm:items-center sm:gap-2">
                <Rocket className="h-3.5 w-3.5 text-brand-500" />
                Shipping weekly
              </div>
              <div className="absolute -right-4 bottom-8 hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-xs font-medium shadow-elevated sm:flex sm:items-center sm:gap-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Open to collabs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-[hsl(var(--border))]/60 bg-[hsl(var(--card))]/30">
        <div className="container-page grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center sm:text-left">
              <p className="display-heading text-3xl text-[hsl(var(--foreground))]">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Expertise */}
      <section className="container-page py-20">
        <div className="max-w-2xl">
          <span className="eyebrow">What I do</span>
          <h2 className="section-title mt-3">A small studio with a wide stack.</h2>
          <p className="section-lead">
            Whether you need a new portfolio, a digital storefront, or a content system that
            scales — these are the building blocks I work with every day.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {expertise.map(({ Icon, title, body }) => (
            <div key={title} className="card-hover group">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500/15 to-indigo-500/10 text-brand-600 ring-1 ring-brand-500/20 transition-colors dark:text-brand-300">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="display-heading mt-5 text-lg">{title}</h3>
              <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured projects */}
      {projects.length > 0 && (
        <section className="container-page py-20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <span className="eyebrow">Selected work</span>
              <h2 className="section-title mt-3">Featured projects</h2>
              <p className="section-lead">
                A few recent builds — products and platforms shipped end to end.
              </p>
            </div>
            <Link href="/projects" className="btn-link">
              All projects <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="card-hover group flex flex-col overflow-hidden p-0"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-brand-500/10 via-indigo-500/10 to-transparent">
                  {p.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="display-heading text-3xl text-[hsl(var(--foreground))]/30">
                        {p.title.slice(0, 1)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="display-heading text-lg">{p.title}</h3>
                  <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] line-clamp-3">
                    {p.summary}
                  </p>
                  {p.techStack.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.techStack.slice(0, 4).map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="btn-link mt-5 inline-flex text-brand-600 dark:text-brand-300">
                    View case study <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      {products.length > 0 && (
        <section className="border-y border-[hsl(var(--border))]/60 bg-[hsl(var(--card))]/30">
          <div className="container-page py-20">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <span className="eyebrow">From the shop</span>
                <h2 className="section-title mt-3">Digital products to ship faster</h2>
                <p className="section-lead">
                  Templates, components, and starters built on the same stack I use for client
                  work.
                </p>
              </div>
              <Link href="/shop" className="btn-link">
                Browse shop <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <Link
                  key={p.id}
                  href={`/shop/${p.slug}`}
                  className="card-hover group flex flex-col overflow-hidden p-0"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-brand-500/10">
                    {p.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag className="h-10 w-10 text-[hsl(var(--foreground))]/25" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="display-heading text-lg">{p.name}</h3>
                      <span className="text-sm font-semibold text-brand-600 dark:text-brand-300">
                        {formatPrice(p.priceCents, p.currency)}
                      </span>
                    </div>
                    {p.category && (
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">
                        {p.category.name}
                      </p>
                    )}
                    <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))] line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest posts */}
      {posts.length > 0 && (
        <section className="container-page py-20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <span className="eyebrow">Notes</span>
              <h2 className="section-title mt-3">From the blog</h2>
              <p className="section-lead">
                Practical write-ups on Next.js, Prisma, design systems, and shipping habits.
              </p>
            </div>
            <Link href="/blog" className="btn-link">
              All posts <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="card-hover group flex flex-col">
                <p className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">
                  {formatDate(p.publishedAt ?? p.createdAt)}
                  {p.category && <span> · {p.category.name}</span>}
                </p>
                <h3 className="display-heading mt-3 text-lg">{p.title}</h3>
                {p.excerpt && (
                  <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] line-clamp-3">
                    {p.excerpt}
                  </p>
                )}
                <span className="btn-link mt-5 inline-flex text-brand-600 dark:text-brand-300">
                  Read post <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA banner */}
      <section className="container-page pb-24 pt-4">
        <div className="surface relative overflow-hidden p-10 sm:p-14">
          <div
            className="absolute -inset-1 -z-10 opacity-80"
            aria-hidden
            style={{
              background:
                'radial-gradient(80% 60% at 0% 0%, hsl(var(--brand-glow) / 0.18), transparent 60%), radial-gradient(60% 60% at 100% 100%, hsl(var(--accent) / 0.18), transparent 60%)',
            }}
          />
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <span className="eyebrow">Let&apos;s build</span>
              <h2 className="display-heading mt-3 text-3xl sm:text-4xl text-balance">
                Have a product, template, or platform in mind?
              </h2>
              <p className="mt-3 max-w-xl text-[hsl(var(--muted-foreground))]">
                Tell me what you need — features, stack, timeline. I&apos;ll respond within 24
                hours with a plan, scope, and rough estimate. No pressure.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/requests" className="btn-primary">
                Submit a request
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn-outline">
                Or send a message
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
