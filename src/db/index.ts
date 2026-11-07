import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Reuse one client across hot reloads / warm serverless invocations.
const g = globalThis as unknown as { _sql?: ReturnType<typeof postgres> };
const sql = (g._sql ??= postgres(process.env.DATABASE_URL!, { max: 3, prepare: false }));
export const db = drizzle(sql, { schema });
