import type { MetadataRoute } from 'next';

import { DISALLOWED_PATHS, resolveSiteUrl } from '@/lib/seo';

// Replaces the static public/robots.txt, which shipped `Host`/`Sitemap` lines for http://localhost:3000.
export default function robots(): MetadataRoute.Robots {
  const siteUrl = resolveSiteUrl();
  return {
    rules: { userAgent: '*', allow: '/', disallow: DISALLOWED_PATHS },
    host: siteUrl,
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
