import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: 'standalone', // Enable standalone output for Docker optimization
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
        pathname: '/**',
      },
      // Production S3/MinIO custom domains (add others as needed)
      {
        protocol: 'https',
        hostname: 'ebic.cit.edu.ly',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com', // For Cloudflare R2
        pathname: '/**',
      },
      ...(process.env.NODE_ENV === 'development' ||
        process.env.S3_ENDPOINT?.includes('localhost')
        ? [
          {
            protocol: 'http' as const,
            hostname: 'localhost',
            port: '9000',
            pathname: '/**',
          },
        ]
        : []),
    ],
    minimumCacheTTL: 86400,
  },

  serverExternalPackages: ['mariadb'],

  // Reduce file system operations to minimize EPERM errors on Windows
  webpack: (config, { isServer: _isServer }) => {
    if (process.platform === 'win32') {
      // Increase retry attempts for file operations
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
