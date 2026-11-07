const headers = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];
export default {
  serverExternalPackages: ['@node-rs/argon2'],
  images: { remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }] },
  async headers() {
    return [
      { source: '/:path*', headers },
      // Short CDN cache for the public page; admin saves show up within ~30s.
      { source: '/', headers: [{ key: 'Cache-Control', value: 'public, max-age=0, s-maxage=30, stale-while-revalidate=300' }] },
      { source: '/admin/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }, { key: 'X-Robots-Tag', value: 'noindex' }] },
    ];
  },
};
