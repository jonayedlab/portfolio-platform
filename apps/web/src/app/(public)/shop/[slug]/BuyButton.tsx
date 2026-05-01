'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';

export default function BuyButton({ productId }: { productId: string }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ order: { id: string } }>('/api/orders/checkout', {
        method: 'POST',
        body: JSON.stringify({ email, items: [{ productId, quantity: 1 }] }),
      });
      setOrderId(res.order.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  }

  if (orderId) {
    return (
      <div className="card border-green-500">
        <p className="font-medium">Order placed (id: <code className="font-mono">{orderId}</code>).</p>
        <p className="text-sm mt-2 text-[hsl(var(--muted-foreground))]">
          This MVP marks orders as <strong>PENDING</strong>. Connect a payment gateway (e.g. Stripe)
          to mark them PAID and unlock the digital download.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleBuy} className="space-y-3 max-w-md">
      <label className="label">Your email</label>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="input"
      />
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Processing…' : 'Buy now'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
