import type { Metadata } from 'next';
import { db } from '../db';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const s = await db.query.settings.findFirst().catch(() => undefined);
  return { title: s?.siteName ? `${s.siteName} — Constellation` : 'Constellation', description: s?.tagline || 'Portfolio' };
}
export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
