import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';

// Middleware already guarantees a valid session for /api/admin/*.
export async function POST() {
  const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = process.env;
  if (!cloud || !key || !secret) return NextResponse.json({ error: 'not configured' }, { status: 503 });
  const timestamp = Math.floor(Date.now() / 1000), folder = 'constellation';
  const signature = createHash('sha1').update(`folder=${folder}&timestamp=${timestamp}${secret}`).digest('hex');
  return NextResponse.json({ cloud_name: cloud, api_key: key, timestamp, folder, signature });
}
