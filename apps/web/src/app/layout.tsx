import './globals.css';
import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME || 'Alifur Rahman Jonayed',
    template: '%s — Alifur Rahman Jonayed',
  },
  description:
    'Portfolio, digital products, and blog by Alifur Rahman Jonayed — full-stack developer building thoughtful, performant web platforms.',
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        {children}
      </body>
    </html>
  );
}
