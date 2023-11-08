/**
 * @type {import('next-sitemap').IConfig}
 * @see https://github.com/iamvishnusankar/next-sitemap#readme
 */

module.exports = {
  // !STARTERCONF Change the siteUrl
  /** Without additional '/' on the end, e.g. https://theodorusclarence.com */
  siteUrl: process.env.NEXT_PUBLIC_ROOT_URL,

  generateRobotsTxt: true,
  sitemapSize: 5000, // sitemap별 최대 크기 (최대 크기가 넘어갈 경우 복수개의 sitemap으로 분리됨)
  changefreq: 'weekly', // 페이지 주소 변경 빈도 (검색엔진에 제공됨) - always, daily, hourly, monthly, never, weekly, yearly 중 택 1
  priority: 1,
  robotsTxtOptions: {
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_ROOT_URL}/sitemap-0.xml`,
      `${process.env.NEXT_PUBLIC_ROOT_URL}/sitemap/artwork.xml`,
      `${process.env.NEXT_PUBLIC_ROOT_URL}/sitemap/post.xml`,
      // `${process.env.NEXT_PUBLIC_ROOT_URL}/sitemap/event.xml`,
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/404', '/new/**', '/user/**', '/_next/**', '/new/**'],
      },
    ],
  },
  exclude: [
    'https://dev.artscope.kr/**',
    '/404',
    '/new/**',
    '/user/**',
    '/_next/**',
    '/new/**',
    '/opengraph-image.png',
  ],
};
