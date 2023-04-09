/**
 * @type {import('next-sitemap').IConfig}
 * @see https://github.com/iamvishnusankar/next-sitemap#readme
 */
module.exports = {
  // !STARTERCONF Change the siteUrl
  /** Without additional '/' on the end, e.g. https://theodorusclarence.com */
  siteUrl: 'https://www.artscope.kr',
  generateRobotsTxt: true,
  sitemapSize: 7000, // sitemap별 최대 크기 (최대 크기가 넘어갈 경우 복수개의 sitemap으로 분리됨)
  changefreq: 'daily', // 페이지 주소 변경 빈도 (검색엔진에 제공됨) - always, daily, hourly, monthly, never, weekly, yearly 중 택 1
  priority: 1,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/404',
          '/artist/**',
          '/oauth2/**',
          '/login',
          '/signup',
          '/admin/**',
          '/api/**',
          '/_next/**',
          '/upload',
        ],
      },
    ],
  },
  exclude: [
    '/404',
    '/artist/**',
    '/oauth2/**',
    '/login',
    '/signup',
    '/admin/**',
    '/api/**',
    '/_next/**',
    '/upload',
  ],
};
