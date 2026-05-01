import Link from 'next/link';
import { serverFetch } from '@/lib/api';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

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
    <div>
      <h1 className="text-3xl font-bold mb-6">Shop</h1>
      {products.length === 0 ? (
        <p className="text-[hsl(var(--muted-foreground))]">No products yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/shop/${p.slug}`}
              className="card hover:border-brand transition-colors"
            >
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              ) : (
                <div className="w-full h-40 bg-[hsl(var(--muted))] rounded mb-3" />
              )}
              <h2 className="font-semibold">{p.name}</h2>
              <p className="mt-1 text-sm font-mono">{formatPrice(p.priceCents, p.currency)}</p>
              {p.category && (
                <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
                  {p.category.name}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
