/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    // Optimize CSS imports
    optimizeCss: true,
    // Enable webpack build worker
    webpackBuildWorker: true,
    // Optimize server-side includes
    optimizeServerReact: true,
  },

  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
    
    // Enable React compiler optimizations
    reactRemoveProperties: process.env.NODE_ENV === 'production' ? {
      properties: ['^data-testid$'],
    } : false,
  },

  // Simple webpack configuration to handle native modules
  webpack: (config, { isServer }) => {
    // Module resolution aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      // Fix @coral-xyz/anchor default export issue
      '@coral-xyz/anchor$': require('path').resolve(__dirname, 'anchor-default.js'),
    };

    // Add Node.js polyfills for browser compatibility
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      buffer: require.resolve("buffer"),
      // Native modules that should be ignored in browser
      'node-datachannel': false,
      'better-sqlite3': false,
      'sqlite3': false,
      'leveldown': false,
      'node-gyp-build': false,
    };

    // For client-side builds, exclude native modules
    if (!isServer) {
      config.externals = [
        ...(config.externals || []),
        'node-datachannel',
        'better-sqlite3',
        'sqlite3',
        'leveldown',
        'node-gyp-build',
      ];

      // Add buffer polyfill
      config.plugins = config.plugins || [];
      config.plugins.push(
        new (require('webpack')).ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );
    }

    return config;
  },

  // Image optimization
  images: {
    // Enable modern formats with fallbacks
    formats: ['image/avif', 'image/webp'],
    // Responsive image sizes for different devices
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Quality settings - remove deprecated option
    // External image domains (add your CDN domains here)
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'avatars.githubusercontent.com',
      'cdn.jsdelivr.net',
    ],
    // Remote patterns for more flexible image sources
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.gstatic.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Enable SVG support with security
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Minimize layout shift
    minimumCacheTTL: 60,
    // Loader for custom image optimization
    loader: 'default',
  },

  // Static optimization
  trailingSlash: false,
  
  // Compression
  compress: true,
  
  // PoweredBy header removal for security
  poweredByHeader: false,

  // Static generation optimization
  output: 'standalone',

  // Environment variables optimization
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Headers for performance and security
  async headers() {
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://accounts.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net data:",
      "img-src 'self' data: blob: https: https://images.unsplash.com https://avatars.githubusercontent.com https://via.placeholder.com",
      "media-src 'self' blob: data:",
      "object-src 'none'",
      "connect-src 'self' https://api.devnet.solana.com https://api.mainnet-beta.solana.com https://api.testnet.solana.com wss://api.devnet.solana.com wss://api.mainnet-beta.solana.com ws://localhost:* wss://localhost:*",
      "frame-src 'self' https://accounts.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'Content-Security-Policy',
            value: cspDirectives,
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Performance headers
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Static assets caching
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // API routes caching
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=60',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Rewrites for API routing
  async rewrites() {
    return [
      {
        source: '/api/socket.io/:path*',
        destination: '/api/socket/:path*',
      },
    ];
  },

  // Turbopack is enabled by default in Next.js 15
  // No additional turbo config needed here
};

module.exports = nextConfig;