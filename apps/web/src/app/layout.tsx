import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME || 'Alifur Rahman Jonayed',
    template: '%s — Alifur Rahman Jonayed',
  },
  description:
    'Portfolio, digital products, and blog by Alifur Rahman Jonayed — full-stack developer.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    title: 'Alifur Rahman Jonayed',
    description: 'Portfolio, digital products, and blog.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
