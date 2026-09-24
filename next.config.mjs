/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enforce no trailing slashes (301 redirect /page/ to /page)
  // Prevents duplicate content issues for SEO
  trailingSlash: false,

  transpilePackages: ['framer-motion'],
  outputFileTracingRoot: process.cwd(),

  // Enable source maps for better debugging (Lighthouse best practice)
  productionBrowserSourceMaps: true,

  // Enable SVG imports as React components
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },

  // Turbopack configuration for inlining small SVGs as data URIs
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['./inline-svg-loader.js'],
        condition: {
          content: /^[\s\S]{0,4000}$/, // Inline SVGs smaller than ~4KB
        },
        as: '*.js',
      },
    },
  },

  // Remove console logs in production
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error'], // Keep console.error for critical issues
          }
        : false,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**', // Optional: Locks it down even further to file paths
      },
    ],
    // Optimized for actual viewport sizes (removed 3840 - unnecessary for web)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    // Lower quality settings - 75% is plenty for web (save bandwidth)
    qualities: [75, 85, 90],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 86400, // Cache for 24 hours (1 day)
    unoptimized: false,
    loader: 'default',
  },

  // Security headers for better Lighthouse score
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
