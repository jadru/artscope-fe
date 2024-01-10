import { getServerSideSitemap } from 'next-sitemap';

import { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_ROOT_URL } from '@/constant/env';

import { LocationResponseType } from '@/types/location';

export const dynamic = 'force-dynamic';
export const revalidate = 3600 * 24;

export async function GET(_request: Request) {
  // Method to source urls from cms
  const data: LocationResponseType = await fetch(
    NEXT_PUBLIC_API_URL + '/api/location/search?keyword=&page=0&size=1000',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
      },
    }
  ).then((res) => res.json());

  return getServerSideSitemap(
    data.locations.map((location) => ({
      loc: `${NEXT_PUBLIC_ROOT_URL}/space/${location.locationId}`,
      changefreq: 'daily',
      priority: 0.9,
    }))
  );
}
