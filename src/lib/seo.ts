// robots.txt / sitemap.xml helpers. Kept free of path aliases and framework imports
// so `node --test tests/seo.test.mjs` can load this file directly (Node strips the types).

export const DEFAULT_SITE_URL = 'https://artscope.jadru.com';

/** Public, indexable routes that exist on the site (checked against src/app/(main) and src/app/about). */
export const PUBLIC_ROUTES: ReadonlyArray<{ path: string; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly'; priority: number }> = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/gallery', changeFrequency: 'daily', priority: 0.9 },
  { path: '/location', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/story', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
];

/** Paths crawlers should skip: editor/account areas, the editor demo page, the 404 route. */
export const DISALLOWED_PATHS = ['/404', '/editor/', '/user/', '/new/', '/simple'];

const LOCAL_HOSTS = /^(localhost|127\.\d+\.\d+\.\d+|0\.0\.0\.0|\[::1\])$/i;

/**
 * Canonical site origin for robots.txt and sitemap.xml.
 * Uses NEXT_PUBLIC_ROOT_URL (set on Vercel) when it is a public https origin; anything empty,
 * malformed, http, or local falls back to https://artscope.jadru.com so crawlers never see localhost.
 */
export function resolveSiteUrl(env: Record<string, string | undefined> = process.env): string {
  const raw = (env.NEXT_PUBLIC_ROOT_URL ?? '').trim();
  if (!raw) return DEFAULT_SITE_URL;
  let url: URL;
  try {
    url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return DEFAULT_SITE_URL;
  }
  if (url.protocol !== 'https:' || LOCAL_HOSTS.test(url.hostname) || url.hostname.endsWith('.vercel.app')) {
    return DEFAULT_SITE_URL;
  }
  return url.origin;
}

export function absoluteUrl(siteUrl: string, path: string): string {
  return path === '/' ? siteUrl : `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
