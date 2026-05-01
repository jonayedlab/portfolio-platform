import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AnalyticsBeacon from '@/components/AnalyticsBeacon';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <AnalyticsBeacon />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
