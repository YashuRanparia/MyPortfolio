import { requireAdmin } from '../../lib/auth';
import Link from 'next/link';
import { sql } from 'drizzle-orm';
import { db } from '../../db';
import { HUBS, nodes } from '../../db/schema';

export default async function Dashboard() {
  await requireAdmin();
  const rows = await db.select({ hub: nodes.hub, n: sql<number>`count(*)::int` }).from(nodes).groupBy(nodes.hub);
  const count = Object.fromEntries(rows.map((r) => [r.hub, r.n]));
  return (
    <>
      <h1>Dashboard</h1>
      <div className="grid">
        {HUBS.map((h) => <Link key={h} href={`/admin/nodes/${h}`} className="card"><h2>{h}</h2><p>{count[h] ?? 0} stars</p></Link>)}
      </div>
    </>
  );
}
