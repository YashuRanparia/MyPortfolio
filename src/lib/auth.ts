import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '../db';
import { admins } from '../db/schema';
import { COOKIE, verifyToken } from './session';

// Full check (signature + DB session version). Call at the top of every admin page and server action;
// middleware only does the cheap signature check.
export async function requireAdmin() {
  const claims = await verifyToken((await cookies()).get(COOKIE)?.value);
  const admin = claims && (await db.query.admins.findFirst({ where: eq(admins.id, Number(claims.sub)) }));
  if (!admin || admin.sessionVersion !== claims.v) redirect('/admin/login');
  return admin;
}
