import Link from 'next/link';
import { serverFetch } from '@/lib/api';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import PageHeader from '@/components/PageHeader';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Shop' };

export default async function ShopPage() {
  let products: Product[] = [];
  try {
    products = (await serverFetch<{ products: Product[] }>('/api/products')).products;
  } catch {
    products = [];
  }
  return (
    <>
      <PageHeader
        eyebrow="Shop"
        title="Digital products"
        description="Templates, components, and starters built on the same stack I use for client work — ship faster without giving up craft."
      />

      <section className="container-page py-16">
        {products.length === 0 ? (
          <div className="card mx-auto max-w-md text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <h2 className="display-heading mt-4 text-lg">No products yet</h2>
            <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
              Products will show up here once they&apos;re added from the admin panel.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="display-heading text-lg">{p.name}</h2>
                    <span className="shrink-0 text-sm font-semibold text-brand-600 dark:text-brand-300">
                      {formatPrice(p.priceCents, p.currency)}
                    </span>
                  </div>
                  {p.category && (
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">
                      {p.category.name}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-[hsl(var(--muted-foreground))] line-clamp-3">
                    {p.description}
                  </p>
                  <span className="btn-link mt-5 inline-flex text-brand-600 dark:text-brand-300">
                    View product <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
