import type { NextConfig } from 'next';


const config: NextConfig = {
  eslint: {
    dirs: ['src'],
  },
  experimental: {
    webpackBuildWorker: true,
    optimizePackageImports: ['react-markdown'],
    externalDir: true,
  },
  transpilePackages: ['react-markdown'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*',
      },
      {
        source: '/kakaomap/:path*',
        destination: 'https://dapi.kakao.com/v2' + '/:path*',
      },
    ];
  },

  reactStrictMode: false,

  images: {
    domains: [process.env.NEXT_PUBLIC_MEDIA_STORAGE_URL ?? ''],
    loader: 'custom',
    loaderFile: './src/utils/imageLoader.ts',
  },

  compress: true,

  output: 'standalone',

}

export default config;