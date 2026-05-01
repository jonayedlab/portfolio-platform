export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[hsl(var(--border))] py-8">
      <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[hsl(var(--muted-foreground))]">
        <p>© {new Date().getFullYear()} Alifur Rahman Jonayed. All rights reserved.</p>
        <p>
          Built with Next.js, Express, and Prisma.{' '}
          <a className="underline hover:text-brand" href="/blog">
            Blog
          </a>{' '}
          ·{' '}
          <a className="underline hover:text-brand" href="/shop">
            Shop
          </a>
        </p>
      </div>
    </footer>
  );
}
