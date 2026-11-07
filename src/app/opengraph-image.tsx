import { ImageResponse } from 'next/og';
import { db } from '../db';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Portfolio preview';
export const dynamic = 'force-dynamic';

export default async function Image() {
  const s = await db.query.settings.findFirst().catch(() => undefined);
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 90, color: '#e8e6f0',
        backgroundColor: '#04050b', backgroundImage: 'radial-gradient(circle at 78% 30%, #7ee0ff33, transparent 40%), radial-gradient(circle at 20% 80%, #c79bff33, transparent 45%), radial-gradient(circle at 85% 80%, #ff8fa333, transparent 35%)' }}>
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 10, color: '#ffcf6b' }}>CONSTELLATION</div>
        <div style={{ display: 'flex', fontSize: 92, fontWeight: 700, marginTop: 24 }}>{s?.siteName || 'Your Name'}</div>
        <div style={{ display: 'flex', fontSize: 36, color: '#8a87a0', marginTop: 16 }}>{s?.tagline || 'Projects, skills and ways to get in touch'}</div>
      </div>
    ),
    size,
  );
}
