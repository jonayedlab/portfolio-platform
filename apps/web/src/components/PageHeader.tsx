import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  children?: React.ReactNode;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  children,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-[hsl(var(--border))]/60 bg-radial-fade">
      <div className="hero-grid absolute inset-0 opacity-60" aria-hidden />
      <div
        className={cn(
          'container-page relative py-16 sm:py-20',
          align === 'center' && 'text-center',
        )}
      >
        {eyebrow && (
          <span className={cn('eyebrow', align === 'center' && 'mx-auto')}>{eyebrow}</span>
        )}
        <h1
          className={cn(
            'display-heading mt-4 text-4xl sm:text-5xl text-balance text-[hsl(var(--foreground))]',
            align === 'center' && 'mx-auto max-w-3xl',
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              'mt-4 max-w-2xl text-lg text-[hsl(var(--muted-foreground))]',
              align === 'center' && 'mx-auto',
            )}
          >
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
