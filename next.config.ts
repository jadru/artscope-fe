import type { NextConfig } from "next";

const config: NextConfig = {
  eslint: {
    dirs: ["src"],
  },
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
    domains: [process.env.NEXT_PUBLIC_MEDIA_STORAGE_URL ?? ""],
    loader: "custom",
    loaderFile: "./src/utils/imageLoader.ts",
  },

  compress: true,
};

export default config;
