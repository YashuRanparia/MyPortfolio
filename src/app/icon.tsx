import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  // Plain shapes only: glyphs would make next/og download a font at build time.
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#04050b', borderRadius: 8 }}>
      <div style={{ width: 12, height: 12, borderRadius: 6, background: '#ffcf6b', boxShadow: '0 0 10px 4px #ffcf6b88' }} />
    </div>,
    size,
  );
}
