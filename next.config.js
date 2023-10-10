/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require('next-pwa');
const nextConfig = {
  ...withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
  }),
  eslint: {
    dirs: ['src'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*',
      },
    ];
  },

  images: {
    domains: [process.env.NEXT_PUBLIC_MEDIA_STORAGE_URL],
    loader: 'custom',
    loaderFile: './src/utils/imageLoader.ts',
    minimumCacheTTL: 60,
  },

  compress: true,

  output: 'standalone',

  // SVGR
  webpack(config, { isServer, webpack }) {
    config.module.rules.push(
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              typescript: true,
              icon: true,
            },
          },
        ],
      },
      {
        test: /\.(mov|mp4|webm|ogg|swf|ogv)$/,
        type: 'asset/resource',
      }
    );
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        path: false,
        dns: false,
      };
    }
    return config;
  },
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
