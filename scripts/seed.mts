// Creates the admin account (from ADMIN_EMAIL / ADMIN_PASSWORD) and sample content on a fresh DB.
// Safe to re-run: existing admin password is reset only with --reset-admin; content is seeded only if empty.
import { hash } from '@node-rs/argon2';
import { db } from '../src/db';
import { admins, nodes, settings } from '../src/db/schema';
import { DEFAULT_HUBS } from '../src/lib/hubs';

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase(), password = process.env.ADMIN_PASSWORD;
if (!email || !password || password.length < 12) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (12+ chars) first');

const passwordHash = await hash(password);
if (process.argv.includes('--reset-admin')) {
  await db.insert(admins).values({ email, passwordHash }).onConflictDoUpdate({ target: admins.email, set: { passwordHash, totpSecret: null, totpEnabled: false } });
} else {
  await db.insert(admins).values({ email, passwordHash }).onConflictDoNothing();
}

await db.insert(settings).values({ id: 1, siteName: 'Yashu Ranparia', tagline: 'drag to explore · click a star', hubs: DEFAULT_HUBS }).onConflictDoNothing();

if ((await db.query.nodes.findFirst()) === undefined) {
  await db.insert(nodes).values([
    { hub: 'about', title: 'Origin', summary: 'Where it started', body: 'Replace me from /admin.', position: 0 },
    { hub: 'about', title: 'Now', summary: 'Current focus', body: 'Replace me from /admin.', position: 1 },
    { hub: 'work', title: 'Project Alpha', summary: 'One-line pitch', body: 'Problem, approach, result.', tags: ['TypeScript', 'Postgres'], position: 0 },
    { hub: 'work', title: 'Project Beta', summary: 'One-line pitch', body: 'Problem, approach, result.', tags: ['React'], position: 1 },
    { hub: 'skills', title: 'Frontend', summary: 'What I build UIs with', tags: ['React', 'Next.js', 'CSS'], position: 0 },
    { hub: 'skills', title: 'Backend', summary: 'APIs and data', tags: ['Node', 'Postgres'], position: 1 },
    { hub: 'contact', title: 'Email', summary: 'you@example.com', url: 'mailto:you@example.com', position: 0 },
  ]);
}
console.log('Seed done for', email);
process.exit(0);
