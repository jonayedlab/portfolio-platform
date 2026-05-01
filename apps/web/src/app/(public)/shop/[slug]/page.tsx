import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/api';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import BuyButton from './BuyButton';

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
    <article className="grid md:grid-cols-2 gap-8 max-w-5xl">
      <div>
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="w-full rounded" />
        ) : (
          <div className="w-full aspect-square bg-[hsl(var(--muted))] rounded" />
        )}
      </div>
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-2 text-2xl font-mono">{formatPrice(product.priceCents, product.currency)}</p>
        <p className="mt-6 whitespace-pre-line">{product.description}</p>
        <div className="mt-8">
          <BuyButton productId={product.id} />
        </div>
      </div>
    </article>
  );
}
