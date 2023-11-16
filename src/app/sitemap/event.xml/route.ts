import { getServerSideSitemap } from 'next-sitemap';

import { NEXT_PUBLIC_API_URL } from '@/constant/env';

import { EventResponseType } from '@/types/event';

export const dynamic = 'force-dynamic';
export const revalidate = 3600 * 24;

export async function GET(_request: Request) {
  // Method to source urls from cms
  const data: EventResponseType = await fetch(
    NEXT_PUBLIC_API_URL + '/api/exhibitions',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
        query: JSON.stringify({
          eventType: 'ALL',
          page: 0,
          size: 1000,
        }),
      },
    }
  ).then((res) => res.json());

  return getServerSideSitemap(
    data.exhibitions.map((event) => ({
      loc: `${NEXT_PUBLIC_API_URL}/event/${event.id}`,
      changefreq: 'daily',
      priority: 0.9,
      lastmod: String(event.updatedTime ?? event.createdTime),
    }))
  );
}
