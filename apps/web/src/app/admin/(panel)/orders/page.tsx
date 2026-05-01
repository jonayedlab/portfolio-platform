'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { Order } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function load() {
    const res = await apiFetch<{ orders: Order[] }>('/api/orders');
    setOrders(res.orders);
  }
  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  async function setStatus(id: string, status: Order['status']) {
    await apiFetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    await load();
  }

  return (
    <div className="space-y-4 max-w-5xl">
      <h1 className="text-2xl font-bold">Orders</h1>
      {orders.length === 0 ? (
        <p className="text-[hsl(var(--muted-foreground))]">No orders yet.</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-[hsl(var(--border))]">
                <th className="py-2">Date</th>
                <th>Email</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-[hsl(var(--border))]">
                  <td className="py-2">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>{o.email}</td>
                  <td>
                    {o.items.map((it) => (
                      <span key={it.id} className="block text-xs">
                        {it.product?.name ?? it.productId} × {it.quantity}
                      </span>
                    ))}
                  </td>
                  <td className="font-mono">{formatPrice(o.totalCents, o.currency)}</td>
                  <td>{o.status}</td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => setStatus(o.id, e.target.value as Order['status'])}
                      className="input"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PAID">PAID</option>
                      <option value="FAILED">FAILED</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
