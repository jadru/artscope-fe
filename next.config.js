/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://art.be.megabrain.kr:443/api/:path*',
      },
      {
        source: '/oauth2',
        destination:
          'https://art.be.megabrain.kr:443/oauth2/authorization/google',
        basePath: false,
      },
    ];
  },

  images: {
    domains: ['media-xi-art-storage.s3.ap-northeast-2.amazonaws.com'],
  },
  reactStrictMode: true,
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
