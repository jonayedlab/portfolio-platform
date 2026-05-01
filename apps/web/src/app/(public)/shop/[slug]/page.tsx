import { notFound } from 'next/navigation';
import Link from 'next/link';
import { serverFetch } from '@/lib/api';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import BuyButton from './BuyButton';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const { product } = await serverFetch<{ product: Product }>(`/api/products/${params.slug}`);
    return { title: product.name, description: product.description.slice(0, 160) };
  } catch {
    return { title: 'Product not found' };
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  let product: Product | null = null;
  try {
    product = (await serverFetch<{ product: Product }>(`/api/products/${params.slug}`)).product;
  } catch {
    product = null;
  }
  if (!product) notFound();

  return (
    <section className="container-page py-10 sm:py-16">
      <Link href="/shop" className="btn-link mb-8 inline-flex">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to shop
      </Link>

      <article className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="surface relative aspect-[4/3] overflow-hidden p-0">
          {product.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-brand-500/10">
              <ShoppingBag className="h-16 w-16 text-[hsl(var(--foreground))]/25" />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            {product.category && (
              <span className="chip-brand">{product.category.name}</span>
            )}
            <h1 className="display-heading mt-3 text-3xl sm:text-4xl text-balance">
              {product.name}
            </h1>
            <p className="mt-3 text-3xl font-semibold text-brand-600 dark:text-brand-300">
              {formatPrice(product.priceCents, product.currency)}
            </p>
          </div>
          <p className="whitespace-pre-line text-[hsl(var(--foreground))]/90">
            {product.description}
          </p>
          <BuyButton productId={product.id} />
        </div>
      </article>
    </section>
  );
}
