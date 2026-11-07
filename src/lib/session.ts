import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const COOKIE = process.env.NODE_ENV === 'production' ? '__Host-sid' : 'sid';
const key = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('SESSION_SECRET must be set to at least 32 characters');
  return new TextEncoder().encode(secret);
};
const TTL = 60 * 60 * 12;

export type Claims = { sub: string; v: number };

export async function verifyToken(token?: string): Promise<Claims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ['HS256'] });
    return { sub: String(payload.sub), v: Number(payload.v) };
  } catch {
    return null;
  }
}

export async function startSession(id: number, version: number) {
  const token = await new SignJWT({ v: version })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(id))
    .setIssuedAt()
    .setExpirationTime(`${TTL}s`)
    .sign(key());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: TTL,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}
