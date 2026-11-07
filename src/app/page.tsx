import { asc, eq } from 'drizzle-orm';
import { db } from '../db';
import { HUBS, nodes } from '../db/schema';
import { SITE_URL } from '../lib/site';
import { DEFAULT_HUBS } from '../lib/hubs';
import Constellation, { type HubData } from '../components/Constellation';

export const dynamic = 'force-dynamic';

// Fixed layout of the four clusters in world space.
const POS = { about: [-520, -260], work: [520, -200], skills: [-420, 380], contact: [460, 400] } as const;

export default async function Home() {
  const [s, all] = await Promise.all([
    db.query.settings.findFirst(),
    db.select().from(nodes).where(eq(nodes.published, true)).orderBy(asc(nodes.position), asc(nodes.id)),
  ]);
  const cfg = s?.hubs ?? DEFAULT_HUBS;
  const hubs: HubData[] = HUBS.map((id) => ({
    id, ...cfg[id], x: POS[id][0], y: POS[id][1],
    nodes: all.filter((n) => n.hub === id).map(({ id, title, summary, body, url, imageUrl, tags }) => ({ id, title, summary, body, url, imageUrl, tags })),
  }));
  // Structured data so search engines can show a person card; "<" is escaped so content can't close the tag.
  const sameAs = all.filter((n) => n.hub === 'contact' && n.url.startsWith('http')).map((n) => n.url);
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: s?.siteName ?? 'Your Name', description: s?.tagline || undefined, url: SITE_URL, sameAs }).replace(/</g, '\\u003c');
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld }} />
    <Constellation hubs={hubs} siteName={s?.siteName ?? 'Your Name'} tagline={s?.tagline ?? ''} resumeUrl={s?.resumeUrl ?? ''} chatEnabled={!!process.env.LLM_API_KEY} />
  </>;
}
