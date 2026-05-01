'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

export default function BuyButton({ productId }: { productId: string }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
        body: JSON.stringify({
          email,
          customerPhone: phone,
          items: [{ productId, quantity: 1 }],
        }),
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
      <div className="surface p-6">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/30">
          <CheckCircle2 className="h-5 w-5" />
        </span>
        <p className="display-heading mt-4 text-lg">Order placed</p>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          Reference{' '}
          <code className="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 font-mono text-xs">
            {orderId}
          </code>
          . We&apos;ll reach out on the email or WhatsApp/contact number you provided to
          coordinate delivery.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleBuy} className="surface space-y-4 p-6">
      <div>
        <h3 className="display-heading text-lg">Checkout</h3>
        <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
          Enter your details and I&apos;ll follow up to confirm the order.
        </p>
      </div>
      <div>
        <label className="label" htmlFor="checkout-email">
          Your email
        </label>
        <input
          id="checkout-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="input"
        />
      </div>
      <div>
        <label className="label" htmlFor="checkout-phone">
          WhatsApp / contact number
        </label>
        <input
          id="checkout-phone"
          type="tel"
          required
          inputMode="tel"
          minLength={5}
          maxLength={40}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+880 1XXX-XXXXXX"
          className="input"
        />
        <p className="mt-1.5 text-xs text-[hsl(var(--muted-foreground))]">
          Include the country code so we can reach you.
        </p>
      </div>
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        <ShoppingBag className="h-4 w-4" />
        {loading ? 'Processing…' : 'Buy now'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
