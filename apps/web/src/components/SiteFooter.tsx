import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, Sparkles } from 'lucide-react';

const productLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/shop', label: 'Shop' },
  { href: '/requests', label: 'Request a build' },
];

const studioLinks = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const socials = [
  { href: 'https://github.com/jonayedlab', label: 'GitHub', Icon: Github },
  { href: 'https://www.linkedin.com/', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://twitter.com/', label: 'Twitter / X', Icon: Twitter },
  { href: 'mailto:hello@example.com', label: 'Email', Icon: Mail },
];

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]/50">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-glow">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">Alifur Rahman Jonayed</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-[hsl(var(--muted-foreground))]">
            Portfolio, digital products, and writing — building thoughtful, performant web
            platforms with Next.js, TypeScript, and PostgreSQL.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] transition-colors hover:border-brand-300 hover:text-[hsl(var(--foreground))]"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title="Work" links={productLinks} />
        <FooterColumn title="Studio" links={studioLinks} />

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]">
            Have an idea?
          </h3>
          <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))]">
            Tell me what you need and I&apos;ll get back to you within 24 hours.
          </p>
          <Link href="/requests" className="btn-outline mt-4 w-full justify-center">
            Submit a request
          </Link>
        </div>
      </div>

      <div className="border-t border-[hsl(var(--border))]">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-[hsl(var(--muted-foreground))] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Alifur Rahman Jonayed. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Built with Next.js, Express &amp; Prisma</span>
            <span aria-hidden>·</span>
            <Link href="/admin/login" className="hover:text-[hsl(var(--foreground))]">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]">
        {title}
      </h3>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-[hsl(var(--foreground))]/80 transition-colors hover:text-[hsl(var(--foreground))]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
