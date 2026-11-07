'use server';
import { and, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { hash, verify } from '@node-rs/argon2';
import { z } from 'zod';
import { db } from '../db';
import { admins, HUBS, nodes, settings } from '../db/schema';
import { requireAdmin } from './auth';
import { endSession, startSession } from './session';
import { checkCode, newSecret } from './totp';

const refresh = () => { revalidatePath('/'); revalidatePath('/admin', 'layout'); };
const httpUrl = z.string().trim().refine((v) => v === '' || /^(https?:\/\/|mailto:)/i.test(v), 'URL must start with http(s):// or mailto:');
const imgUrl = z.string().trim().refine((v) => v === '' || /^https:\/\//i.test(v), 'Image must be an https URL');

export async function logout() { await endSession(); redirect('/admin/login'); }

// ---- nodes ----
const NodeInput = z.object({
  hub: z.enum(HUBS),
  title: z.string().trim().min(1).max(120),
  summary: z.string().trim().max(300),
  body: z.string().max(20000),
  url: httpUrl,
  imageUrl: imgUrl,
  tags: z.string().transform((s) => s.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 40)),
  published: z.boolean(),
});

export async function saveNode(form: FormData) {
  await requireAdmin();
  const id = Number(form.get('id')) || null;
  const data = NodeInput.parse({
    hub: form.get('hub'), title: form.get('title'), summary: form.get('summary') ?? '', body: form.get('body') ?? '',
    url: form.get('url') ?? '', imageUrl: form.get('imageUrl') ?? '', tags: form.get('tags') ?? '', published: form.get('published') === 'on',
  });
  if (id) {
    await db.update(nodes).set({ ...data, updatedAt: new Date() }).where(and(eq(nodes.id, id), eq(nodes.hub, data.hub)));
  } else {
    const [{ m }] = await db.select({ m: sql<number>`coalesce(max(${nodes.position}), -1)::int` }).from(nodes).where(eq(nodes.hub, data.hub));
    await db.insert(nodes).values({ ...data, position: m + 1 });
  }
  refresh();
}

export async function deleteNode(form: FormData) {
  await requireAdmin();
  await db.delete(nodes).where(eq(nodes.id, Number(form.get('id'))));
  refresh();
}

// Swap position with the neighbour in the given direction.
export async function moveNode(form: FormData) {
  await requireAdmin();
  const id = Number(form.get('id')), dir = form.get('dir') === 'up' ? -1 : 1;
  const me = await db.query.nodes.findFirst({ where: eq(nodes.id, id) });
  if (!me) return;
  const siblings = await db.select().from(nodes).where(eq(nodes.hub, me.hub)).orderBy(nodes.position, nodes.id);
  const i = siblings.findIndex((s) => s.id === id), j = i + dir;
  if (j < 0 || j >= siblings.length) return;
  [siblings[i], siblings[j]] = [siblings[j], siblings[i]];
  await db.transaction(async (tx) => {
    for (const [pos, s] of siblings.entries()) await tx.update(nodes).set({ position: pos }).where(eq(nodes.id, s.id));
  });
  refresh();
}

// ---- settings ----
const Color = z.string().regex(/^#[0-9a-fA-F]{6}$/);
export async function saveSettings(form: FormData) {
  await requireAdmin();
  const hubs = Object.fromEntries(HUBS.map((h) => [h, z.object({
    name: z.string().trim().min(1).max(30), blurb: z.string().trim().max(300), color: Color,
  }).parse({ name: form.get(`${h}.name`), blurb: form.get(`${h}.blurb`), color: form.get(`${h}.color`) })])) as never;
  const v = {
    siteName: z.string().trim().min(1).max(80).parse(form.get('siteName')),
    tagline: z.string().trim().max(200).parse(form.get('tagline') ?? ''),
    resumeUrl: imgUrl.parse(form.get('resumeUrl') ?? ''),
    hubs,
  };
  await db.insert(settings).values({ id: 1, ...v }).onConflictDoUpdate({ target: settings.id, set: v });
  refresh();
}

// ---- security ----
export type Msg = { ok?: string; err?: string } | null;

export async function changePassword(_: Msg, form: FormData): Promise<Msg> {
  const admin = await requireAdmin();
  const next = String(form.get('next') ?? '');
  if (next.length < 12) return { err: 'New password must be at least 12 characters.' };
  if (!(await verify(admin.passwordHash, String(form.get('current') ?? '')))) return { err: 'Current password is wrong.' };
  const [row] = await db.update(admins).set({ passwordHash: await hash(next), sessionVersion: sql`${admins.sessionVersion} + 1` })
    .where(eq(admins.id, admin.id)).returning();
  await startSession(row.id, row.sessionVersion); // keep this device, drop every other session
  return { ok: 'Password changed. Other sessions were signed out.' };
}

export async function signOutEverywhere() {
  const admin = await requireAdmin();
  await db.update(admins).set({ sessionVersion: sql`${admins.sessionVersion} + 1` }).where(eq(admins.id, admin.id));
  await endSession();
  redirect('/admin/login');
}

export async function beginTotp() {
  const admin = await requireAdmin();
  await db.update(admins).set({ totpSecret: newSecret(), totpEnabled: false }).where(eq(admins.id, admin.id));
  revalidatePath('/admin/security');
}

export async function confirmTotp(_: Msg, form: FormData): Promise<Msg> {
  const admin = await requireAdmin();
  if (!admin.totpSecret || !checkCode(admin.totpSecret, String(form.get('code') ?? ''))) return { err: 'Code did not match. Try the next one.' };
  await db.update(admins).set({ totpEnabled: true }).where(eq(admins.id, admin.id));
  revalidatePath('/admin/security');
  return { ok: '2FA enabled.' };
}

export async function disableTotp(_: Msg, form: FormData): Promise<Msg> {
  const admin = await requireAdmin();
  if (!(await verify(admin.passwordHash, String(form.get('password') ?? '')))) return { err: 'Password is wrong.' };
  await db.update(admins).set({ totpSecret: null, totpEnabled: false }).where(eq(admins.id, admin.id));
  revalidatePath('/admin/security');
  return { ok: '2FA disabled.' };
}
