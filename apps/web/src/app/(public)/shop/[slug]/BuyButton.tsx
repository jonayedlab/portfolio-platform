'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';

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
      <div className="card border-green-500">
        <p className="font-medium">Order placed (id: <code className="font-mono">{orderId}</code>).</p>
        <p className="text-sm mt-2 text-[hsl(var(--muted-foreground))]">
          This MVP marks orders as <strong>PENDING</strong>. We&apos;ll reach out on the email or
          WhatsApp/contact number you provided to coordinate delivery. Connect a payment gateway
          (e.g. Stripe) to mark them PAID and unlock the digital download automatically.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleBuy} className="space-y-3 max-w-md">
      <div>
        <label className="label" htmlFor="checkout-email">Your email</label>
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
        <label className="label" htmlFor="checkout-phone">WhatsApp / contact number</label>
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
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
          We use this to follow up about your order. Include the country code.
        </p>
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Processing…' : 'Buy now'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
