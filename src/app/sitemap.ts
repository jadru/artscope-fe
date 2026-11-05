import type { MetadataRoute } from 'next';

import { PUBLIC_ROUTES, absoluteUrl, resolveSiteUrl } from '@/lib/seo';

export const revalidate = 86400; // regenerate daily

type MagazineList = { magazines?: { id: number | string; updatedTime?: string; createdTime?: string }[] };

/** Best effort: articles and profiles from the API. Any failure leaves the static routes in place. */
async function fetchJson<T>(path: string): Promise<T | null> {
  const api = process.env.NEXT_PUBLIC_API_URL;
  if (!api) return null;
  try {
    const res = await fetch(api + path, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(5000), next: { revalidate } });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = resolveSiteUrl();
  const entries: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((route) => ({
    url: absoluteUrl(siteUrl, route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const [articles, members] = await Promise.all([
    fetchJson<MagazineList>('/api/magazines?size=1000&page=0'),
    fetchJson<string[]>('/api/members/username'),
  ]);
  for (const m of articles?.magazines ?? []) {
    const time = m.updatedTime ?? m.createdTime;
    const date = time ? new Date(time) : null;
    entries.push({
      url: absoluteUrl(siteUrl, `/article/${encodeURIComponent(String(m.id))}`),
      changeFrequency: 'weekly',
      priority: 0.8,
      ...(date && !Number.isNaN(date.getTime()) ? { lastModified: date } : {}),
    });
  }
  for (const username of Array.isArray(members) ? members : []) {
    if (typeof username === 'string' && username) {
      entries.push({ url: absoluteUrl(siteUrl, `/profile/${encodeURIComponent(username)}`), changeFrequency: 'weekly', priority: 0.5 });
    }
  }
  return entries;
}
