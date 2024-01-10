import { getServerSideSitemap } from 'next-sitemap';

import { NEXT_PUBLIC_API_URL } from '@/constant/env';

export const dynamic = 'force-dynamic';
export const revalidate = 3600 * 24;

export async function GET(_request: Request) {
  // Method to source urls from cms
  const data: string[] = await fetch(
    NEXT_PUBLIC_API_URL + '/api/members/username',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
      },
    }
  ).then((res) => res.json());

  return getServerSideSitemap(
    data.map((members) => ({
      loc: `${NEXT_PUBLIC_API_URL}/profile/${members}`,
      changefreq: 'daily',
      priority: 0.9,
    }))
  );
}
