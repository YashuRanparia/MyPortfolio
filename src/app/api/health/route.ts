import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '../../../db';

export const dynamic = 'force-dynamic';

// For uptime monitors and container health checks: 200 only if the database answers.
export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
