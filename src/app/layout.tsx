import type { Metadata, Viewport } from 'next';
import { db } from '../db';
import { SITE_URL } from '../lib/site';
import './globals.css';

export const viewport: Viewport = { themeColor: '#04050b', colorScheme: 'dark' };

export async function generateMetadata(): Promise<Metadata> {
  const s = await db.query.settings.findFirst().catch(() => undefined);
  const name = s?.siteName || 'Constellation';
  const title = `${name} — Portfolio`;
  const description = s?.tagline || `${name}'s interactive portfolio: projects, skills and ways to get in touch.`;
  return {
    metadataBase: new URL(SITE_URL),
    title, description,
    alternates: { canonical: '/' },
    openGraph: { type: 'website', siteName: name, title, description, url: '/' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
