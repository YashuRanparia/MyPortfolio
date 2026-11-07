import { desc } from 'drizzle-orm';
import { db } from '../../../db';
import { auditLog } from '../../../db/schema';
import { requireAdmin } from '../../../lib/auth';

export default async function Activity() {
  await requireAdmin();
  const rows = await db.select().from(auditLog).orderBy(desc(auditLog.at), desc(auditLog.id)).limit(100);
  return (
    <>
      <h1>Activity</h1>
      <table className="log">
        <tbody>{rows.map((r) => (
          <tr key={r.id}><td>{r.at.toISOString().replace('T', ' ').slice(0, 19)}</td><td><code>{r.action}</code></td><td>{r.detail}</td></tr>
        ))}</tbody>
      </table>
      {rows.length === 0 && <p className="dim">Nothing yet.</p>}
    </>
  );
}
