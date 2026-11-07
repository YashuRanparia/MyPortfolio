'use server';
import { and, eq, gt, sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { verify, hash } from '@node-rs/argon2';
import { db } from '../../../db';
import { admins, loginAttempts } from '../../../db/schema';
import { startSession } from '../../../lib/session';
import { checkCode } from '../../../lib/totp';

const MAX_FAILS = 5;
const WINDOW_MIN = 15;
// Verified against when the email is unknown so response time doesn't reveal valid emails.
const DUMMY = hash('dummy-password');

export async function login(_: string | null, form: FormData): Promise<string | null> {
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');
  const code = String(form.get('code') ?? '');
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0].trim() ?? 'local';
  const key = `${ip}|${email}`;

  const since = new Date(Date.now() - WINDOW_MIN * 60_000);
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(loginAttempts)
    .where(and(eq(loginAttempts.key, key), gt(loginAttempts.at, since)));
  if (n >= MAX_FAILS) return `Too many attempts. Try again in ${WINDOW_MIN} minutes.`;

  const admin = await db.query.admins.findFirst({ where: eq(admins.email, email) });
  const passOk = await verify(admin?.passwordHash ?? (await DUMMY), password);
  const totpOk = !admin?.totpEnabled || (!!admin.totpSecret && checkCode(admin.totpSecret, code));

  if (!admin || !passOk || !totpOk) {
    await db.insert(loginAttempts).values({ key });
    return admin?.totpEnabled && passOk ? 'Invalid authenticator code.' : 'Invalid email or password.';
  }
  await db.delete(loginAttempts).where(eq(loginAttempts.key, key));
  await startSession(admin.id, admin.sessionVersion);
  redirect('/admin');
}
