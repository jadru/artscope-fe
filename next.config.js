/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src'],
  },
  async rewrites() {
    return [
      {
        source: '/util/:path*',
        destination: 'https://api.artscope.kr/api/:path*',
      },
    ];
  },

  images: {
    domains: ['d14sxnpwbfro1f.cloudfront.net/prod'],
    loader: 'custom',
    loaderFile: './src/utils/imageLoader.ts',
    minimumCacheTTL: 60,
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },

  reactStrictMode: false,
  swcMinify: true,
  output: 'standalone',

  future: {
    webpack5: true,
  },

  // SVGR
  webpack(config) {
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
    return config;
  },
};

module.exports = nextConfig;
