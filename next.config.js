/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static export in development to allow dynamic routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Allow dynamic routes and API endpoints
  experimental: {
    esmExternals: 'loose',
  },
};

module.exports = nextConfig;