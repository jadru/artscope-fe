import type { NextConfig } from "next";

// Must equal CANONICAL_SITE_URL in src/lib/seo.ts (asserted in tests/seo.test.mjs).
export const CANONICAL_ORIGIN = "https://artscope.jadru.com";
export const LEGACY_HOSTS = ["artscope.kr", "www.artscope.kr"];

/** Host-based 308s: legacy domains → canonical origin, path and query kept. */
export function legacyHostRedirects() {
  return LEGACY_HOSTS.map((host) => ({
    source: "/:path*",
    has: [{ type: "host" as const, value: host }],
    destination: `${CANONICAL_ORIGIN}/:path*`,
    permanent: true, // 308
  }));
}

export const LEGACY_SITEMAP_PATHS = ["/sitemap/article.xml", "/sitemap/user.xml"];

const config: NextConfig = {
  async redirects() {
    // Old next-sitemap endpoints (500 in production) now point at the generated /sitemap.xml.
    return [
      // artscope.kr and www.artscope.kr → https://artscope.jadru.com (308, path and query kept).
      ...legacyHostRedirects(),
      ...LEGACY_SITEMAP_PATHS.map((source) => ({
        source,
        destination: "/sitemap.xml",
        permanent: true, // 308
      })),
    ];
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

  experimental: {
    // 매칭되지 않는 URL도 서버 HTML에 lang="ko"와 404 화면을 포함하도록 global-not-found.tsx 사용
    globalNotFound: true,
  },

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
