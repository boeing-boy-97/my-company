/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    // Route architecture (v4 IA): old URLs redirect permanently so inbound
    // links and search-engine history keep working.
    return [
      { source: '/process', destination: '/approach', permanent: true },
      { source: '/about', destination: '/studio', permanent: true },
      { source: '/services/software', destination: '/services/custom-software', permanent: true },
      { source: '/services/integration', destination: '/services/system-integration', permanent: true },
    ];
  },
  async headers() {
    const security = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];
    if (process.env.NODE_ENV === 'production') {
      security.push({ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' });
    }
    return [
      { source: '/:path*', headers: security },
    ];
  },
};

export default nextConfig;
