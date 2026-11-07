import { SignJWT } from 'jose';
import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { middleware } from '../src/middleware';

const key = new TextEncoder().encode(process.env.SESSION_SECRET);
const token = () => new SignJWT({ v: 0 }).setProtectedHeader({ alg: 'HS256' }).setSubject('1').setExpirationTime('1h').sign(key);
const req = (path: string, cookie?: string) => new NextRequest(`http://localhost:3000${path}`, { headers: cookie ? { cookie: `sid=${cookie}` } : {} });

describe('admin middleware', () => {
  it('lets the login page through', async () => expect((await middleware(req('/admin/login'))).status).toBe(200));
  it('redirects signed-out admin pages to login', async () => {
    const res = await middleware(req('/admin/settings'));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:3000/admin/login');
  });
  it('answers signed-out admin API calls with 401', async () => expect((await middleware(req('/api/admin/upload-signature'))).status).toBe(401));
  it('lets a valid session through', async () => expect((await middleware(req('/admin', await token()))).status).toBe(200));
  it('rejects a forged cookie', async () => expect((await middleware(req('/admin', 'forged'))).status).toBe(307));
});
