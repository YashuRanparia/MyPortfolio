// Black-box checks against a running instance: `BASE=http://localhost:3000 npm run smoke`.
const base = process.env.BASE || 'http://localhost:3000';
let failed = 0;
const check = async (name, fn) => {
  try { const msg = await fn(); if (msg) throw new Error(msg); console.log('ok  ', name); }
  catch (e) { failed++; console.error('FAIL', name, '-', e.message); }
};
const get = (path, init) => fetch(base + path, { redirect: 'manual', ...init });

await check('home renders', async () => { const r = await get('/'); const t = await r.text(); return r.status !== 200 ? `status ${r.status}` : !t.includes('application/ld+json') ? 'missing JSON-LD' : null; });
await check('security headers', async () => { const r = await get('/'); return r.headers.get('x-frame-options') !== 'DENY' ? 'no X-Frame-Options' : null; });
await check('health', async () => { const r = await get('/api/health'); return r.status !== 200 ? `status ${r.status}` : null; });
await check('robots hides admin', async () => { const t = await (await get('/robots.txt')).text(); return /Disallow: \/admin/.test(t) ? null : 'admin not disallowed'; });
await check('sitemap', async () => { const r = await get('/sitemap.xml'); return r.status !== 200 ? `status ${r.status}` : null; });
await check('og image', async () => { const r = await get('/opengraph-image'); return r.headers.get('content-type') !== 'image/png' ? `type ${r.headers.get('content-type')}` : null; });
await check('admin redirects to login', async () => { const r = await get('/admin'); return r.status !== 307 || !r.headers.get('location')?.endsWith('/admin/login') ? `status ${r.status}` : null; });
await check('admin API needs auth', async () => { const r = await get('/api/admin/upload-signature', { method: 'POST' }); return r.status !== 401 ? `status ${r.status}` : null; });
await check('chat refuses foreign origin', async () => { const r = await get('/api/chat', { method: 'POST', headers: { origin: 'http://evil.example', 'content-type': 'application/json' }, body: '{}' }); return ![403, 503].includes(r.status) ? `status ${r.status}` : null; });
await check('404 page', async () => { const r = await get('/nope'); return r.status !== 404 ? `status ${r.status}` : null; });

if (failed) { console.error(`${failed} check(s) failed`); process.exit(1); }
console.log('all smoke checks passed');
