import type { MetadataRoute } from 'next';

import { PUBLIC_ROUTES, absoluteUrl, loadDynamicEntries, resolveSiteUrl } from '@/lib/seo';

// Regenerated at most hourly (ISR). A failed regeneration throws, and Next.js keeps serving the last
// good sitemap and retries on a later request, so an API outage never replaces it with a partial one.
export const revalidate = 3600;

const API_TIMEOUT_MS = 5000;

async function fetchJson(path: string): Promise<unknown> {
  const api = process.env.NEXT_PUBLIC_API_URL;
  if (!api) throw new Error('NEXT_PUBLIC_API_URL is not set');
  const res = await fetch(api + path, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = resolveSiteUrl();
  const staticEntries: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((route) => ({
    url: absoluteUrl(siteUrl, route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const { entries, failures } = await loadDynamicEntries(siteUrl, fetchJson);
  if (failures.length > 0) {
    const isBuild = process.env.NEXT_PHASE === 'phase-production-build';
    console.error('[sitemap.xml] article/profile entries unavailable', {
      phase: isBuild ? 'build' : 'revalidate',
      failures,
    });
    // At runtime, throw so the previously generated sitemap stays cached. During `next build` there is
    // no previous version, so publish the static routes (plus any source that did load); the short
    // revalidate window above retries within an hour.
    if (!isBuild) throw new Error(`sitemap.xml regeneration failed: ${failures.join('; ')}`);
  }
  return [...staticEntries, ...entries];
}
