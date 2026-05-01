import { serverFetch } from '@/lib/api';
import type { AnalyticsSummary } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let s: AnalyticsSummary | null = null;
  try {
    s = await serverFetch<AnalyticsSummary>('/api/analytics/summary');
  } catch {
    s = null;
  }

  if (!s) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-3 text-[hsl(var(--muted-foreground))]">
          Could not load analytics. Make sure the API is running and the database is migrated.
        </p>
      </div>
    );
  }

  const stats = [
    { label: 'Products', value: s.counts.products },
    { label: 'Posts', value: s.counts.posts },
    { label: 'Projects', value: s.counts.projects },
    { label: 'Orders', value: s.counts.orders },
    { label: 'Pageviews (24h)', value: s.pageviews.last24h },
    { label: 'Pageviews (30d)', value: s.pageviews.last30d },
    { label: 'Unique visitors (30d)', value: s.uniqueVisitors30d },
    { label: 'Sales (paid)', value: formatPrice(s.sales.totalPaidCents) },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Overview of your platform.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st) => (
          <div key={st.label} className="card">
            <p className="text-xs uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
              {st.label}
            </p>
            <p className="mt-2 text-2xl font-semibold">{st.value}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">Top pages (30d)</h2>
        {s.topPages.length === 0 ? (
          <p className="text-sm text-[hsl(var(--muted-foreground))]">No pageviews yet.</p>
        ) : (
          <ul className="card divide-y divide-[hsl(var(--border))]">
            {s.topPages.map((p) => (
              <li key={p.path} className="flex justify-between py-2 text-sm">
                <span className="font-mono">{p.path}</span>
                <span>{p.views}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Recent visits</h2>
        {s.recent.length === 0 ? (
          <p className="text-sm text-[hsl(var(--muted-foreground))]">No recent activity.</p>
        ) : (
          <ul className="card divide-y divide-[hsl(var(--border))]">
            {s.recent.map((r) => (
              <li key={r.id} className="flex justify-between py-2 text-sm">
                <span className="font-mono">{r.path}</span>
                <span className="text-[hsl(var(--muted-foreground))]">
                  {new Date(r.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
