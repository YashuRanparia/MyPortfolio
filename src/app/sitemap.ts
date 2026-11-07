import { desc } from 'drizzle-orm';
import type { MetadataRoute } from 'next';
import { db } from '../db';
import { nodes } from '../db/schema';
import { SITE_URL } from '../lib/site';

export const dynamic = 'force-dynamic';

// Single-page site: one URL, dated by the most recent content edit.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const last = await db.select({ at: nodes.updatedAt }).from(nodes).orderBy(desc(nodes.updatedAt)).limit(1).catch(() => []);
  return [{ url: SITE_URL, lastModified: last[0]?.at ?? new Date(), changeFrequency: 'monthly', priority: 1 }];
}
