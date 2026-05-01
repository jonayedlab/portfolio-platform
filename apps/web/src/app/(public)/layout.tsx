import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AnalyticsBeacon from '@/components/AnalyticsBeacon';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <AnalyticsBeacon />
      <main className="container-page py-10">{children}</main>
      <SiteFooter />
    </>
  );
}
