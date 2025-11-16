/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Image optimization configuration
  images: {
    domains: [
      'localhost',
      // Add your production domain
      'dr-nawaf.com',
      // Add any CDN domains you use
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // Cache images for 60 seconds
  },

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
    ]
  },

  // Rewrites for URL optimization
  async rewrites() {
    return []
  },

  // Redirects
  async redirects() {
    return []
  },

  // Experimental features
  experimental: {
    // Enable optimizeCss in production
    optimizeCss: process.env.NODE_ENV === 'production',
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add any custom webpack configuration here
    return config
  },

  // Environment variables available on the client side
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // PoweredBy header removal for security
  poweredByHeader: false,

  // Compression
  compress: true,

  // Production source maps (disable for better performance)
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
