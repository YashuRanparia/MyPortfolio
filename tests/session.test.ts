import { SignJWT } from 'jose';
import { describe, expect, it } from 'vitest';
import { verifyToken } from '../src/lib/session';

const key = new TextEncoder().encode(process.env.SESSION_SECRET);
const sign = (exp: string | number, secret = key) =>
  new SignJWT({ v: 3 }).setProtectedHeader({ alg: 'HS256' }).setSubject('7').setIssuedAt().setExpirationTime(exp).sign(secret);

describe('verifyToken', () => {
  it('accepts a valid token and returns its claims', async () => {
    expect(await verifyToken(await sign('1h'))).toEqual({ sub: '7', v: 3 });
  });
  it('rejects missing, garbage, expired, tampered and wrongly-signed tokens', async () => {
    const good = await sign('1h');
    expect(await verifyToken(undefined)).toBeNull();
    expect(await verifyToken('not-a-jwt')).toBeNull();
    expect(await verifyToken(await sign(Math.floor(Date.now() / 1000) - 60))).toBeNull();
    expect(await verifyToken(good.slice(0, -2) + 'xx')).toBeNull();
    expect(await verifyToken(await sign('1h', new TextEncoder().encode('another-secret-another-secret-12345')))).toBeNull();
  });
});
