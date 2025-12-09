import type { NextConfig } from "next";

const config: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/kakaomap/:path*",
        destination: "https://dapi.kakao.com/v2" + "/:path*",
      },
    ];
  },

  reactStrictMode: true,

  images: {
    remotePatterns: process.env.NEXT_PUBLIC_MEDIA_STORAGE_URL
      ? [
          {
            protocol: "https",
            hostname: process.env.NEXT_PUBLIC_MEDIA_STORAGE_URL,
          },
        ]
      : [],
    loader: "custom",
    loaderFile: "./src/utils/imageLoader.ts",
    unoptimized: true,
  },

  compress: true,

  turbopack: {
    root: process.cwd(),
  },
};

export default config;
