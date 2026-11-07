import Link from 'next/link';
import { cookies } from 'next/headers';
import { HUBS } from '../../db/schema';
import { logout } from '../../lib/admin-actions';
import { COOKIE, verifyToken } from '../../lib/session';

// Chrome only when signed in (the login page renders bare). Each page/action still calls requireAdmin().
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await verifyToken((await cookies()).get(COOKIE)?.value))) return children;
  return (
    <div className="panel">
      <aside>
        <Link href="/" target="_blank">↗ View site</Link>
        <nav>
          {HUBS.map((h) => <Link key={h} href={`/admin/nodes/${h}`}>{h}</Link>)}
          <Link href="/admin/settings">settings</Link>
          <Link href="/admin/security">security</Link>
        </nav>
        <form action={logout}><button className="ghost">Sign out</button></form>
      </aside>
      <main>{children}</main>
    </div>
  );
}
